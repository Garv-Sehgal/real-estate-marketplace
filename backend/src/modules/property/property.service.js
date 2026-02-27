const crypto = require('crypto');
const {
    createProperty,
    getApprovedProperties,
    getPropertiesByOwner,
    getPropertyById
} = require('./property.store');

/**
 * Create Property
 */
const createPropertyService = async (userId, data) => {

    if (!data.title || !data.category || !data.listingType || !data.city || !data.address) {
        throw new Error('Missing required fields');
    }

    const propertyData = {
        id: crypto.randomUUID(),
        ownerId: userId,

        category: data.category.toLowerCase(),
        listingType: data.listingType.toLowerCase(),

        title: data.title,
        description: data.description || '',

        location: {
            city: data.city,
            address: data.address,
            latitude: data.latitude,
            longitude: data.longitude
        },

        pricing: data.pricing || {},
        details: data.details || {},

        amenities: data.amenities || [],
        images: data.images || [],

        // NEW CORRECT REVIEW STRUCTURE
        review: {
            status: 'pending',
            message: '',
            reviewedBy: null,
            reviewedAt: null
        }
    };

    return await createProperty(propertyData);
};


/**
 * Public marketplace listings
 */
const getMarketplaceProperties = async () => {
    return await getApprovedProperties();
};


/**
 * Logged-in user's listings
 */
const getMyProperties = async (userId) => {
    return await getPropertiesByOwner(userId);
};


/**
 * Single property details
 */
const getPropertyDetails = async (propertyId) => {

    const property = await getPropertyById(propertyId);

    if (!property) {
        throw new Error('Property not found');
    }

    return property;
};


module.exports = {
    createPropertyService,
    getMarketplaceProperties,
    getMyProperties,
    getPropertyDetails
};