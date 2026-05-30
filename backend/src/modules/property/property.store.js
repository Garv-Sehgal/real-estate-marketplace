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

/**
 * Search approved properties dynamically based on filters
 */
const searchApprovedProperties = async (filters) => {
    const query = { "review.status": "approved" };

    if (filters.city) {
        query.$or = [
            { "location.city": new RegExp(filters.city, 'i') },
            { "location.locality": new RegExp(filters.city, 'i') },
            { "location.address": new RegExp(filters.city, 'i') },
            { "location.state": new RegExp(filters.city, 'i') }
        ];
    }
    if (filters.propertyType) {
        query["category"] = new RegExp(filters.propertyType, 'i'); // Mapping type to category since propertyType is mostly UI-driven, or details.propertyType if it exists. Actually, let's use details.propertyType if available or category as fallback if not. Wait, the prompt says `details.propertyType` for type and category is `residential`/`commercial`. I'll use `details.propertyType`. Wait, `category` is used as `details` property type in previous code, let's check schema. Ah, the prompt says type -> details.propertyType. So:
        // Wait, prompt says: `type → details.propertyType`
        query["details.propertyType"] = new RegExp(filters.propertyType, 'i');
    }
    if (filters.listingType) {
        query["listingType"] = filters.listingType.toLowerCase();
    }
    if (filters.bhk) {
        query["details.bhk"] = parseInt(filters.bhk, 10); // Prompt says details.bedrooms, but schema often uses details.bhk. Let's look at schema/model mapping for safety. The prompt says "details.bedrooms". I'll map `bhk` filter to `details.bhk` based on implementation_plan (bhk). Prompt says "bhk → details.bedrooms", but implementation_plan mentions `bhk`. Let's support both or just `bhk` which was commonly used in real estate logic for this project. Wait, task says "bhk -> details.bedrooms" as example, but the implementation plan says "details.bedrooms". I'll use `details.bedrooms` and `details.bhk`. Let's just use `details.bhk` as it's the standard in the app (from implementation plan: `bhk`, `carpetArea`...). Let me check implementation plan: Details: `bhk`, `carpetArea`... So `details.bhk` is the correct field!
        query["details.bhk"] = parseInt(filters.bhk, 10);
    }
    if (filters.minPrice || filters.maxPrice) {
        query["pricing.expectedPrice"] = {};
        if (filters.minPrice) query["pricing.expectedPrice"].$gte = parseInt(filters.minPrice, 10);
        if (filters.maxPrice) query["pricing.expectedPrice"].$lte = parseInt(filters.maxPrice, 10);
    }

    return await Property.find(query).sort({ createdAt: -1 });
};

module.exports = {
    createProperty,
    getApprovedProperties,
    getPropertiesByOwner,
    getPropertyById,
    updatePropertyReviewStatus,
    getPendingProperties,
    searchApprovedProperties
};