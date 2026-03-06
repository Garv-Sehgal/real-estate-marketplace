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
        coverImage: property.coverImage,

        // public owner info
        listedBy: {
            userId: property.ownerId,
            name: property.ownerName || 'Property Owner',
            phone: property.ownerPhone || null
        },

        // flat fields for easy frontend access
        ownerName: property.ownerName || 'Property Owner',
        ownerPhone: property.ownerPhone || null,

        createdAt: property.createdAt
    };
};

module.exports = { mapPropertyToPublic };