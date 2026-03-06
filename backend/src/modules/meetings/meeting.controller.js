const {
    createMeetingRequest,
    getIncomingRequests,
    getSentRequests,
    updateMeetingStatus
} = require('./meeting.service');

/**
 * POST /meetings
 * Authenticated user requests a meeting for a property.
 */
const requestMeeting = async (req, res, next) => {
    try {
        const requesterId = req.user.userId;
        const { propertyId, preferredDate, preferredTime, message } = req.body;

        if (!propertyId || !preferredDate) {
            return res.status(400).json({
                success: false,
                message: 'propertyId and preferredDate are required'
            });
        }

        const meeting = await createMeetingRequest({
            requesterId,
            propertyId,
            preferredDate,
            preferredTime,
            message
        });

        res.status(201).json({ success: true, data: meeting });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /meetings/incoming
 * Get all meeting requests directed at the logged-in user (owner/landlord/agent).
 */
const getIncoming = async (req, res, next) => {
    try {
        const ownerId = req.user.userId;
        const meetings = await getIncomingRequests(ownerId);
        res.status(200).json({ success: true, data: meetings });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /meetings/sent
 * Get all meeting requests sent by the logged-in user.
 */
const getSent = async (req, res, next) => {
    try {
        const requesterId = req.user.userId;
        const meetings = await getSentRequests(requesterId);
        res.status(200).json({ success: true, data: meetings });
    } catch (error) {
        next(error);
    }
};

/**
 * PATCH /meetings/:id/status
 * Owner confirms or rejects a meeting request.
 */
const updateStatus = async (req, res, next) => {
    try {
        const ownerId = req.user.userId;
        const { id } = req.params;
        const { status } = req.body;

        const meeting = await updateMeetingStatus(id, ownerId, status);
        res.status(200).json({ success: true, data: meeting });
    } catch (error) {
        next(error);
    }
};

module.exports = { requestMeeting, getIncoming, getSent, updateStatus };
