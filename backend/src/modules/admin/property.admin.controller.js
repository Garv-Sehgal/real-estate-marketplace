const {
    approveProperty,
    rejectProperty,
    requestChanges,
    fetchPendingProperties,
    getPropertyForAdmin
} = require('./property.admin.service');

/**
 * Approve property
 */
const approve = async (req, res, next) => {
    try {
        const adminId = req.user.userId;
        const { id } = req.params;

        const property = await approveProperty(id, adminId);

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
const reject = async (req, res, next) => {
    try {
        const adminId = req.user.userId;
        const { id } = req.params;
        const message = req.body?.message;

        const property = await rejectProperty(id, adminId, message);

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
const requestEdit = async (req, res, next) => {
    try {
        const adminId = req.user.userId;
        const { id } = req.params;
        const message = req.body?.message;

        const property = await requestChanges(id, adminId, message);

        res.status(200).json({
            success: true,
            message: 'Changes requested from owner',
            data: property
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Get pending properties for admin moderation panel
 */
const getPending = async (req, res, next) => {
    try {
        const properties = await fetchPendingProperties();

        res.status(200).json({
            success: true,
            count: properties.length,
            data: properties
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Get property details for admin (full data)
 */
const getPropertyDetailsAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;

        const property = await getPropertyForAdmin(id);

        res.status(200).json({
            success: true,
            data: property
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    approve,
    reject,
    requestEdit,
    getPending,
    getPropertyDetailsAdmin
};