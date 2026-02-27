const { createPropertyService, getMarketplaceProperties, getMyProperties, getPropertyDetails } = require('./property.service');
const { mapPropertyToPublic } = require('./property.public.mapper');

/**
 * Create Property Controller
 */
const createProperty = async (req, res, next) => {
    try {
        const userId = req.user.userId;   // comes from auth middleware
        const result = await createPropertyService(userId, req.body);

        res.status(201).json({
            success: true,
            message: 'Property created successfully',
            data: result
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Get all approved properties (public)
 */
const getMarketplace = async (req, res, next) => {
    try {
        const properties = await getMarketplaceProperties();

        const publicProperties = properties.map(mapPropertyToPublic);

        res.status(200).json({
            success: true,
            data: publicProperties
        });
        
    } catch (error) {
        next(error);
    }
};


/**
 * Get logged-in user's properties
 */
const getMyListings = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const properties = await getMyProperties(userId);

        res.status(200).json({
            success: true,
            data: properties
        });

    } catch (error) {
        next(error);
    }
};


/**
 * Get property by id (PUBLIC VIEW)
 */
const getPropertyByIdController = async (req, res, next) => {
    try {
        const { id } = req.params;

        const property = await getPropertyDetails(id);

        const publicProperty = mapPropertyToPublic(property);

        res.status(200).json({
            success: true,
            data: publicProperty
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createProperty,
    getMarketplace,
    getMyListings,
    getPropertyByIdController
};