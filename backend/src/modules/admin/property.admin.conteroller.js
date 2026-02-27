const propertyAdminService = require('./property.admin.service');

/**
 * Approve property
 */
const approveProperty = async (req, res, next) => {
    try {
        const adminId = req.user.userId;
        const { id } = req.params;

        const property = await propertyAdminService.approveProperty(id, adminId);

        res.status(200).json({
            success: true,
            message: 'Property approved',
            data: property
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Reject property
 */
const rejectProperty = async (req, res, next) => {
    try {
        const adminId = req.user.userId;
        const { id } = req.params;
        const { message } = req.body;

        const property = await propertyAdminService.rejectProperty(id, adminId, message);

        res.status(200).json({
            success: true,
            message: 'Property rejected',
            data: property
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Request changes
 */
const requestChanges = async (req, res, next) => {
    try {
        const adminId = req.user.userId;
        const { id } = req.params;
        const { message } = req.body;

        const property = await propertyAdminService.requestChanges(id, adminId, message);

        res.status(200).json({
            success: true,
            message: 'Changes requested from owner',
            data: property
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    approveProperty,
    rejectProperty,
    requestChanges
};