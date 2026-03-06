const Meeting = require('./meeting.model');
const User = require('../auth/auth.user.model');
const Property = require('../property/property.model');

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
const updateMeetingStatus = async (meetingId, ownerId, status) => {
    if (!['confirmed', 'rejected'].includes(status)) {
        throw new Error('Invalid status. Must be confirmed or rejected.');
    }

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) throw new Error('Meeting request not found');
    if (meeting.ownerId !== ownerId) throw new Error('Unauthorized');
    if (meeting.status !== 'pending') throw new Error('Meeting request is no longer pending');

    meeting.status = status;
    await meeting.save();
    return meeting;
};

module.exports = {
    createMeetingRequest,
    getIncomingRequests,
    getSentRequests,
    updateMeetingStatus
};
