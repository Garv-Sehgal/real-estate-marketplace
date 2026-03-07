const crypto = require('crypto');
const User = require('../auth/auth.user.model');
const {
    createProperty,
    getApprovedProperties,
    getPropertiesByOwner,
    getPropertyById,
    searchApprovedProperties
} = require('./property.store');

/**
 * Create Property
 */
const createPropertyService = async (userId, data) => {

    if (!data.title || !data.category || !data.listingType || !data.location?.city || !data.location?.address) {
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
            country: data.location.country,
            state: data.location.state,
            city: data.location.city,
            pincode: data.location.pincode,
            locality: data.location.locality,
            subLocality: data.location.subLocality,
            landmark: data.location.landmark,
            address: data.location.address,
            latitude: data.location.latitude,
            longitude: data.location.longitude,
            nearbyFacilities: data.location.nearbyFacilities || []
        },

        pricing: data.pricing || {},
        details: data.details || {},

        amenities: data.amenities || [],
        images: data.images || [],
        coverImage: data.coverImage || null,

        verification: {
            govtId: data.govtId || null,
            ownershipProof: data.ownershipProof || null,
            geoTagConfirmed: data.geoTagConfirmed || false
        },

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
 * Single property details (with owner name enrichment)
 */
const getPropertyDetails = async (propertyId) => {

    const property = await getPropertyById(propertyId);

    if (!property) {
        throw new Error('Property not found');
    }

    // Attach owner info for public display
    const owner = await User.findOne({ id: property.ownerId });
    const plainProperty = property.toObject ? property.toObject() : { ...property };
    plainProperty.ownerName = owner ? owner.fullName : 'Property Owner';
    plainProperty.ownerPhone = owner ? (owner.phone || null) : null;

    return plainProperty;
};


/**
 * Search properties (public)
 */
const searchProperties = async (filters) => {
    return await searchApprovedProperties(filters);
};

module.exports = {
    createPropertyService,
    getMarketplaceProperties,
    getMyProperties,
    getPropertyDetails,
    searchProperties
};