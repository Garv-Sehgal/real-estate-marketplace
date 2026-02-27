const { updatePropertyReviewStatus, getPropertyById, getPendingProperties } = require('../property/property.store');

const ensureActionAllowed = (currentStatus, action) => {

    const allowedTransitions = {
        pending: ['approved', 'rejected', 'changes_requested'],
        changes_requested: ['approved', 'rejected'],
        approved: [],
        rejected: []
    };

    if (!allowedTransitions[currentStatus].includes(action)) {
        throw new Error(`Cannot change status from ${currentStatus} to ${action}`);
    }
};

/**
 * Approve Property
 */
const approveProperty = async (propertyId, adminId) => {

    const property = await getPropertyById(propertyId);
    if (!property) throw new Error('Property not found');

    ensureActionAllowed(property.review.status, 'approved');

    return await updatePropertyReviewStatus(propertyId, {
        status: 'approved',
        message: '',
        reviewedBy: adminId,
        reviewedAt: new Date()
    });
};


/**
 * Reject Property
 */
const rejectProperty = async (propertyId, adminId, message) => {

    const property = await getPropertyById(propertyId);
    if (!property) throw new Error('Property not found');

    if (!message) throw new Error('Rejection reason required');

    ensureActionAllowed(property.review.status, 'rejected');

    return await updatePropertyReviewStatus(propertyId, {
        status: 'rejected',
        message,
        reviewedBy: adminId,
        reviewedAt: new Date()
    });
};


/**
 * Request Changes
 */
const requestChanges = async (propertyId, adminId, message) => {

    const property = await getPropertyById(propertyId);
    if (!property) throw new Error('Property not found');

    if (!message) throw new Error('Change instructions required');

    ensureActionAllowed(property.review.status, 'changes_requested');

    return await updatePropertyReviewStatus(propertyId, {
        status: 'changes_requested',
        message,
        reviewedBy: adminId,
        reviewedAt: new Date()
    });
};

/**
 * Get pending properties for moderation panel
 */
const fetchPendingProperties = async () => {
    return await getPendingProperties();
};

/**
 * Get full property details for admin (no sanitization)
 */
const getPropertyForAdmin = async (propertyId) => {
    const property = await getPropertyById(propertyId);
    if (!property) throw new Error('Property not found');
    return property;
};

module.exports = {
    approveProperty,
    rejectProperty,
    requestChanges,
    fetchPendingProperties,
    getPropertyForAdmin
};