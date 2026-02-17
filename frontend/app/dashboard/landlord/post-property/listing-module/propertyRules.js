export const PROPERTY_CATEGORIES = {
    RESIDENTIAL: 'Residential',
    COMMERCIAL: 'Commercial',
    LAND: 'Land',
    INDUSTRIAL: 'Industrial'
};

export const PROPERTY_TYPES = {
    // Residential
    FLAT: 'Flat',
    VILLA: 'Villa / Independent House',
    RESIDENTIAL_PLOT: 'Residential Plot',

    // Commercial
    OFFICE: 'Office',
    SHOP: 'Shop',
    SHOWROOM: 'Showroom',
    COMMERCIAL_PLOT: 'Commercial Plot',

    // Land
    AGRICULTURAL_LAND: 'Agricultural Land',
    VACANT_LAND: 'Vacant / Open Land',
    PLOT_LAND: 'Plot (Land Category)',

    // Industrial
    WAREHOUSE: 'Warehouse',
    FACTORY: 'Factory / Industrial Building',
    INDUSTRIAL_PLOT: 'Industrial Plot'
};

// Define the fields that are VISIBLE for each type
export const PROPERTY_RULES = {
    [PROPERTY_CATEGORIES.RESIDENTIAL]: {
        [PROPERTY_TYPES.FLAT]: [
            'bhk', 'builtUpArea', 'carpetArea', 'superArea', 'floorNumber', 'totalFloors', 'facing', 'furnishingStatus', 'availabilityStatus'
        ],
        [PROPERTY_TYPES.VILLA]: [
            'bhk', 'plotArea', 'builtUpArea', 'carpetArea', 'facing', 'totalFloors', 'furnishingStatus', 'availabilityStatus'
        ],
        [PROPERTY_TYPES.RESIDENTIAL_PLOT]: [
            'plotArea', 'facing', 'availabilityStatus'
        ]
    },
    [PROPERTY_CATEGORIES.COMMERCIAL]: {
        [PROPERTY_TYPES.OFFICE]: [
            'carpetArea', 'builtUpArea', 'floorNumber', 'totalFloors', 'furnishingStatus', 'availabilityStatus'
        ],
        [PROPERTY_TYPES.SHOP]: [
            'carpetArea', 'floorNumber', 'furnishingStatus', 'availabilityStatus'
        ],
        [PROPERTY_TYPES.SHOWROOM]: [
            'carpetArea', 'builtUpArea', 'floorNumber', 'totalFloors', 'furnishingStatus', 'availabilityStatus'
        ],
        [PROPERTY_TYPES.COMMERCIAL_PLOT]: [
            'plotArea', 'facing', 'availabilityStatus'
        ]
    },
    [PROPERTY_CATEGORIES.LAND]: {
        [PROPERTY_TYPES.AGRICULTURAL_LAND]: [
            'plotArea', 'facing', 'availabilityStatus'
        ],
        [PROPERTY_TYPES.VACANT_LAND]: [
            'plotArea', 'facing', 'availabilityStatus'
        ],
        [PROPERTY_TYPES.PLOT_LAND]: [
            'plotArea', 'facing', 'availabilityStatus'
        ]
    },
    [PROPERTY_CATEGORIES.INDUSTRIAL]: {
        [PROPERTY_TYPES.WAREHOUSE]: [
            'builtUpArea', 'carpetArea', 'floorNumber', 'availabilityStatus'
        ],
        [PROPERTY_TYPES.FACTORY]: [
            'builtUpArea', 'plotArea', 'totalFloors', 'availabilityStatus'
        ],
        [PROPERTY_TYPES.INDUSTRIAL_PLOT]: [
            'plotArea', 'availabilityStatus'
        ]
    }
};

export const getVisibleFields = (category, type) => {
    if (!category || !type) return [];
    return PROPERTY_RULES[category]?.[type] || [];
};
