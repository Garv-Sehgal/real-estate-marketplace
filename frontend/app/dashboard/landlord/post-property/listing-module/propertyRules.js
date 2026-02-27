export const PROPERTY_CATEGORIES = {
    RESIDENTIAL: 'Residential',
    COMMERCIAL: 'Commercial'
};

export const PROPERTY_TYPES = {
    // Residential
    FLAT: 'Flat',
    HOUSE: 'House',
    VILLA: 'Villa',

    // Commercial
    OFFICE: 'Office',
    SHOP: 'Shop',
    SHOWROOM: 'Showroom'
};

// Define the fields that are VISIBLE for each type
export const PROPERTY_RULES = {
    [PROPERTY_CATEGORIES.RESIDENTIAL]: {
        [PROPERTY_TYPES.FLAT]: [
            'bhk', 'carpetArea', 'superArea', 'floorNumber', 'totalFloors', 'facing', 'furnishingStatus', 'availabilityStatus', 'amenities'
        ],
        [PROPERTY_TYPES.HOUSE]: [
            'bhk', 'carpetArea', 'totalFloors', 'facing', 'furnishingStatus', 'availabilityStatus', 'amenities'
        ],
        [PROPERTY_TYPES.VILLA]: [
            'bhk', 'carpetArea', 'totalFloors', 'facing', 'furnishingStatus', 'availabilityStatus', 'amenities'
        ]
    },
    [PROPERTY_CATEGORIES.COMMERCIAL]: {
        [PROPERTY_TYPES.OFFICE]: [
            'carpetArea', 'floorNumber', 'totalFloors', 'furnishingStatus', 'availabilityStatus', 'amenities',
            'cabins', 'workstations', 'conferenceRoom', 'pantry', 'washroomsCount', 'parkingCount', 'powerBackup'
        ],
        [PROPERTY_TYPES.SHOP]: [
            'description', 'carpetArea', 'floorNumber', 'totalFloors', 'furnishingStatus', 'availabilityStatus', 'amenities',
            'locatedIn', 'entranceWidth', 'roadFacing', 'washroomsCount', 'parkingAvailability', 'parkingCount'
        ],
        [PROPERTY_TYPES.SHOWROOM]: [
            'description', 'carpetArea', 'floorNumber', 'totalFloors', 'furnishingStatus', 'availabilityStatus', 'propertyAge', 'amenities',
            'locatedIn', 'entranceWidth', 'ceilingHeight', 'roadFacing', 'washroomsCount', 'parkingAvailability', 'parkingCount'
        ]
    }
};

export const getVisibleFields = (category, type) => {
    if (!category || !type) return [];
    return PROPERTY_RULES[category]?.[type] || [];
};
