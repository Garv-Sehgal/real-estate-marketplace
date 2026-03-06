const { updatePropertyReviewStatus, getPropertyById, getPendingProperties, getPropertiesByOwner } = require('../property/property.store');
const { findUserById } = require('../auth/auth.user.store');

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
    const properties = await getPendingProperties();

    // Hydrate owner names
    return await Promise.all(properties.map(async (prop) => {
        const propObj = prop.toObject ? prop.toObject() : prop;
        if (prop.ownerId) {
            try {
                const owner = await findUserById(prop.ownerId);
                if (owner) {
                    propObj.owner = {
                        id: owner.id,
                        name: owner.fullName,
                        email: owner.email,
                        role: owner.role
                    };
                }
            } catch (e) {
                console.error("Error fetching owner for property listing:", e);
            }
        }
        return propObj;
    }));
};

/**
 * Get full property details for admin (no sanitization)
 */
const getPropertyForAdmin = async (propertyId) => {
    const property = await getPropertyById(propertyId);
    if (!property) throw new Error('Property not found');

    const propertyObj = property.toObject ? property.toObject() : property;

    if (property.ownerId) {
        const owner = await findUserById(property.ownerId);
        if (owner) {
            let totalListings = 0;
            try {
                const ownerProperties = await getPropertiesByOwner(property.ownerId);
                totalListings = ownerProperties ? ownerProperties.length : 0;
            } catch (e) {
                console.error("Error fetching owner properties count:", e);
            }

            propertyObj.owner = {
                id: owner.id,
                name: owner.fullName,
                email: owner.email,
                phone: owner.phone,
                role: owner.role,
                mobileVerified: true,
                emailVerified: true,
                kycStatus: "verified",
                totalListings: totalListings,
                accountStatus: owner.status,
                accountCreatedAt: owner.createdAt
            };
        }
    }

    return propertyObj;
};

module.exports = {
    approveProperty,
    rejectProperty,
    requestChanges,
    fetchPendingProperties,
    getPropertyForAdmin
};