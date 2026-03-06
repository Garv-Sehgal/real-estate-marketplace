const { createPropertyService, getMarketplaceProperties, getMyProperties, getPropertyDetails } = require('./property.service');
const { mapPropertyToPublic } = require('./property.public.mapper');

const parseNumber = (value) => {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value === 'string') {
        const cleanVal = value.replace(/,/g, '').trim();
        const num = parseFloat(cleanVal);
        return isNaN(num) ? undefined : num;
    }
    const num = Number(value);
    return isNaN(num) ? undefined : num;
};

/**
 * Create Property Controller
 */
const createProperty = async (req, res, next) => {
    try {
        const userId = req.user.userId;   // comes from auth middleware

        // Parse arrays from stringified versions
        let amenities = req.body.amenities ? JSON.parse(req.body.amenities) : [];
        let nearbyFacilities = req.body.nearbyFacilities ? JSON.parse(req.body.nearbyFacilities) : [];

        // Construct absolute base URL so frontend <img src="..." /> won't 404
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        // 1. Build structured location
        const location = {
            country: req.body.country,
            state: req.body.state,
            city: req.body.city,
            pincode: req.body.pincode,
            locality: req.body.locality,
            subLocality: req.body.subLocality,
            landmark: req.body.landmark,
            address: req.body.address,
            latitude: parseNumber(req.body.latitude),
            longitude: parseNumber(req.body.longitude),
            nearbyFacilities
        };

        // 2. Build structured pricing conditionally
        const pricing = {};
        const listingType = (req.body.listingType || '').toLowerCase();

        if (listingType === 'rent') {
            pricing.monthlyRent = parseNumber(req.body.monthlyRent);
            pricing.securityDeposit = parseNumber(req.body.securityDeposit);
            pricing.maintenanceIncluded = req.body.maintenanceIncluded;
            pricing.electricityCharges = req.body.electricityCharges;
            pricing.waterCharges = req.body.waterCharges;
        } else if (listingType === 'sell') {
            pricing.expectedPrice = parseNumber(req.body.expectedPrice);
            pricing.bookingAmount = parseNumber(req.body.bookingAmount);
            pricing.propertyTax = parseNumber(req.body.propertyTax);
            pricing.pricePerSqft = parseNumber(req.body.pricePerSqft);
        } else if (listingType === 'pg') {
            pricing.rentPerBed = parseNumber(req.body.rentPerBed);
            pricing.securityDepositPG = parseNumber(req.body.securityDepositPG);
            pricing.electricityIncludedPG = req.body.electricityIncludedPG;
            pricing.waterIncludedPG = req.body.waterIncludedPG;
        }

        // 3. Build structured details based on available fields from frontend
        const details = {
            propertyType: req.body.propertyType,
            bedrooms: parseNumber(req.body.bhk),
            bhk: req.body.bhk,
            bathrooms: parseNumber(req.body.bathrooms),
            balconies: parseNumber(req.body.balconies),
            floorNumber: parseNumber(req.body.floorNumber),
            totalFloors: parseNumber(req.body.totalFloors),
            furnishingStatus: req.body.furnishingStatus,
            facing: req.body.facing,
            superArea: parseNumber(req.body.superArea),
            carpetArea: parseNumber(req.body.carpetArea),
            availabilityStatus: req.body.availabilityStatus,
            cabins: parseNumber(req.body.cabins),
            workstations: parseNumber(req.body.workstations),
            conferenceRoom: parseNumber(req.body.conferenceRoom),
            pantry: parseNumber(req.body.pantry),
            washroomsCount: parseNumber(req.body.washroomsCount),
            parkingCount: parseNumber(req.body.parkingCount),
            powerBackup: req.body.powerBackup,
            entranceWidth: parseNumber(req.body.entranceWidth),
            ceilingHeight: parseNumber(req.body.ceilingHeight),
            propertyOwnership: req.body.propertyOwnership,
            possessionDate: req.body.possessionDate,
            availableFrom: req.body.availableFrom,
            occupancyStatus: req.body.occupancyStatus,
            visitingHours: req.body.visitingHours,
            sharingType: req.body.sharingType,
            bedType: req.body.bedType,
            availableBeds: parseNumber(req.body.availableBeds),
            attachedBathroom: req.body.attachedBathroom,
            foodIncluded: req.body.foodIncluded,
            foodType: req.body.foodType,
            gateClosingTime: req.body.gateClosingTime,
            visitorAllowed: req.body.visitorAllowed,
            wardenAvailable: req.body.wardenAvailable,
            roadFacing: req.body.roadFacing
        };

        // 4. Assemble final structured payload
        const verification = {
            govtId: undefined,
            ownershipProof: undefined,
            geoTagConfirmed: String(req.body.geoTagConfirmed) === 'true'
        };

        const payload = {
            title: req.body.title,
            description: req.body.description || '',
            category: req.body.category ? req.body.category.toLowerCase() : undefined,
            listingType: req.body.listingType ? req.body.listingType.toLowerCase() : undefined,
            location,
            pricing,
            details,
            amenities,
            verification,
            images: [],
            coverImage: null
        };

        // 5. Handle uploaded images using multer (ARRAY fallback + FIELDS fallback)
        if (req.files) {
            if (Array.isArray(req.files)) {
                // If the route used upload.array() or upload.any()
                if (req.files.length > 0) {
                    payload.images = req.files.map(file => `${baseUrl}/uploads/properties/${file.filename}`);
                    payload.coverImage = payload.images[0];
                }
            } else {
                // If the route used upload.fields()
                if (req.files['images']) {
                    payload.images = req.files['images'].map(file => `${baseUrl}/uploads/properties/${file.filename}`);
                }
                if (req.files['coverImage'] && req.files['coverImage'][0]) {
                    payload.coverImage = `${baseUrl}/uploads/properties/${req.files['coverImage'][0].filename}`;
                } else if (payload.images && payload.images.length > 0) {
                    payload.coverImage = payload.images[0];
                }
                if (req.files['govtId'] && req.files['govtId'][0]) {
                    payload.verification.govtId = `${baseUrl}/uploads/properties/${req.files['govtId'][0].filename}`;
                }
                if (req.files['ownershipProof'] && req.files['ownershipProof'][0]) {
                    payload.verification.ownershipProof = `${baseUrl}/uploads/properties/${req.files['ownershipProof'][0].filename}`;
                }
            }
        }

        const result = await createPropertyService(userId, payload);

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