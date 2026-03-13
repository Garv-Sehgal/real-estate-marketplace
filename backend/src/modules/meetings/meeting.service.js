const Meeting = require('./meeting.model');
const User = require('../auth/auth.user.model');
const Property = require('../property/property.model');
const Conversation = require('../chat/models/conversation.model');
const Message = require('../chat/models/message.model');
const { encryptMessage } = require('../../utils/encryption');

const injectMeetingMessage = async ({ senderId, receiverId, propertyStringId, content, type, metadata }) => {
    try {
        const sender = await User.findOne({ id: senderId });
        const receiver = await User.findOne({ id: receiverId });
        const property = await Property.findOne({ id: propertyStringId });

        if (!sender || !receiver || !property) return null;

        let conversation = await Conversation.findOne({
            propertyId: property._id,
            participants: { $all: [sender._id, receiver._id] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                propertyId: property._id,
                participants: [sender._id, receiver._id]
            });
        }

        const encryptedContent = encryptMessage(content, conversation._id.toString());
        
        const message = await Message.create({
            conversationId: conversation._id,
            senderId: sender._id,
            receiverId: receiver._id,
            propertyId: property._id,
            encryptedMessage: encryptedContent,
            type: type,
            metadata: metadata,
            replyTo: null
        });

        const currentUnread = conversation.unreadCounts?.get(receiver._id.toString()) || 0;
        conversation.unreadCounts.set(receiver._id.toString(), currentUnread + 1);
        conversation.lastMessage = encryptedContent;
        conversation.updatedAt = Date.now();
        await conversation.save();

        // Note: Ideally emit 'update_unread_count' here if we had access to io instance. 
        // We will make the frontend poll or wait for next message.

        return message;
    } catch (error) {
        console.error('Failed to inject meeting message:', error);
        return null; // non-fatal
    }
};

/**
 * Create a meeting request.
 * Looks up the property to find the ownerId.
 */
const createMeetingRequest = async ({ requesterId, propertyId, preferredDate, preferredTime, message }) => {
    // Fetch requester details
    const requester = await User.findOne({ id: requesterId });
    if (!requester) throw new Error('Requester not found');

    // Fetch property to get ownerId and title
    // The property model uses a custom UUID `id` field, not MongoDB's `_id`
    const property = await Property.findOne({ id: propertyId });
    if (!property) throw new Error('Property not found');

    const ownerId = property.ownerId; // the person who listed it
    if (!ownerId) throw new Error('Property owner not found');

    if (ownerId === requesterId) throw new Error('You cannot request a meeting for your own property');

    const meeting = await Meeting.create({
        propertyId: property._id.toString(),
        propertyTitle: property.title || 'Untitled Property',
        requesterId,
        requesterName: requester.fullName,
        requesterEmail: requester.email,
        requesterPhone: requester.phone || '',
        ownerId,
        preferredDate,
        preferredTime: preferredTime || '',
        message: message || '',
        status: 'pending'
    });

    await injectMeetingMessage({
        senderId: requesterId,
        receiverId: ownerId,
        propertyStringId: propertyId,
        content: `Meeting requested for ${property.title} on ${preferredDate} at ${preferredTime || 'any time'}`,
        type: 'meeting_request',
        metadata: {
            meetingId: meeting._id.toString(),
            action: 'request',
            preferredDate,
            preferredTime,
            message: message || ''
        }
    });

    return meeting;
};

/**
 * Get all meeting requests directed AT the logged-in owner.
 */
const getIncomingRequests = async (ownerId) => {
    return Meeting.find({ ownerId }).sort({ createdAt: -1 });
};

/**
 * Get all meeting requests sent BY the logged-in user.
 */
const getSentRequests = async (requesterId) => {
    return Meeting.find({ requesterId }).sort({ createdAt: -1 });
};

/**
 * Update the status of a meeting request (confirm or reject).
 * Only the owner of the property can do this.
 */
const updateMeetingStatus = async (meetingId, userId, status) => {
    if (!['confirmed', 'rejected'].includes(status)) {
        throw new Error('Invalid status. Must be confirmed or rejected.');
    }

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) throw new Error('Meeting request not found');
    if (meeting.ownerId !== userId && meeting.requesterId !== userId) {
        throw new Error('Unauthorized');
    }
    if (meeting.status !== 'pending') throw new Error('Meeting request is no longer pending');

    meeting.status = status;
    await meeting.save();

    // Update the original meeting request messages in the conversation to be 'confirmed'
    await Message.updateMany(
        { "metadata.meetingId": meetingId.toString(), type: "meeting_request", "metadata.action": { $ne: "superseded" } },
        { $set: { "metadata.action": status } }
    );

    // Fetch original property to get string ID
    const property = await Property.findById(meeting.propertyId);

    if (property && status !== 'confirmed') {
        const isOwner = meeting.ownerId === userId;
        const receiverId = isOwner ? meeting.requesterId : meeting.ownerId;

        await injectMeetingMessage({
            senderId: userId,
            receiverId: receiverId,
            propertyStringId: property.id,
            content: `Meeting for ${property.title} has been ${status}.`,
            type: 'text',
            metadata: {
                meetingId: meeting._id.toString(),
                action: status
            }
        });
    }

    return meeting;
};

/**
 * Reschedule a meeting request (Change Schedule).
 */
const rescheduleMeeting = async (meetingId, senderStringId, preferredDate, preferredTime, message) => {
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) throw new Error('Meeting request not found');
    
    // Authorization: either owner or requester can reschedule
    if (meeting.ownerId !== senderStringId && meeting.requesterId !== senderStringId) {
        throw new Error('Unauthorized');
    }

    meeting.preferredDate = preferredDate;
    meeting.preferredTime = preferredTime || '';
    if (message) meeting.message = message;
    meeting.status = 'pending';
    await meeting.save();

    // Mark previous requests as superseded so buttons hide on frontend
    await Message.updateMany(
        { "metadata.meetingId": meetingId.toString(), type: "meeting_request" },
        { $set: { "metadata.action": "superseded" } }
    );

    const isOwner = meeting.ownerId === senderStringId;
    const receiverId = isOwner ? meeting.requesterId : meeting.ownerId;
    const property = await Property.findById(meeting.propertyId);

    if (property) {
        await injectMeetingMessage({
            senderId: senderStringId,
            receiverId: receiverId,
            propertyStringId: property.id,
            content: `Meeting rescheduled for ${property.title} to ${preferredDate} at ${preferredTime || 'any time'}.`,
            type: 'meeting_request',
            metadata: {
                meetingId: meeting._id.toString(),
                action: 'reschedule',
                preferredDate,
                preferredTime,
                message: message || ''
            }
        });
    }

    return meeting;
};

module.exports = {
    createMeetingRequest,
    getIncomingRequests,
    getSentRequests,
    updateMeetingStatus,
    rescheduleMeeting
};
