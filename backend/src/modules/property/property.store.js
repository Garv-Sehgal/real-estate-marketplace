const Property = require('./property.model');

/**
 * Create property
 */
const createProperty = async (propertyData) => {
    const property = new Property(propertyData);
    return await property.save();
};

/**
 * Get all approved properties (public marketplace)
 */
const getApprovedProperties = async () => {
    return await Property.find({ "review.status": "approved" })
        .sort({ createdAt: -1 });
};

/**
 * Get properties of a specific owner
 */
const getPropertiesByOwner = async (ownerId) => {
    return await Property.find({ ownerId })
        .sort({ createdAt: -1 });
};

/**
 * Get property by id
 */
const getPropertyById = async (propertyId) => {
    return await Property.findOne({ id: propertyId });
};

/**
 * Update review status (admin approval/rejection)
 */
const updatePropertyReviewStatus = async (propertyId, reviewData) => {
    return await Property.findOneAndUpdate(
        { id: propertyId },
        {
            $set: {
                "review.status": reviewData.status,
                "review.message": reviewData.message || '',
                "review.reviewedBy": reviewData.reviewedBy,
                "review.reviewedAt": reviewData.reviewedAt
            }
        },
        { new: true }
    );
};

/**
 * Get pending properties (admin moderation)
 */
const getPendingProperties = async () => {
    return await Property.find({ "review.status": "pending" })
        .sort({ createdAt: -1 });
};

module.exports = {
    createProperty,
    getApprovedProperties,
    getPropertiesByOwner,
    getPropertyById,
    updatePropertyReviewStatus,
    getPendingProperties
};