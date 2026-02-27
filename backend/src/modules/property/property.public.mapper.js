/**
 * Convert full property document → public safe response
 * Buyers/Tenants should not see moderation or internal fields
 */
const mapPropertyToPublic = (property) => {

    if (!property) return null;

    return {
        id: property.id,
        title: property.title,
        description: property.description,

        category: property.category,
        listingType: property.listingType,

        location: property.location,
        pricing: property.pricing,
        details: property.details,

        amenities: property.amenities,
        images: property.images,

        // public owner info (later we will replace with profile lookup)
        listedBy: {
            userId: property.ownerId
        },

        createdAt: property.createdAt
    };
};

module.exports = { mapPropertyToPublic };