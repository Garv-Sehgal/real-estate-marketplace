export const FIELD_CONFIG = [
    {
        sectionId: 'basicInfo',
        title: 'Basic Info',
        stepIndex: 1,
        fields: [
            { label: 'Property Title', name: 'title', type: 'text', visibleIf: () => true },
            { label: 'Listing Type', name: 'listingType', type: 'text', visibleIf: () => true },
            { label: 'Available For', name: 'genderAllowed', type: 'text', visibleIf: (data) => data.listingType === 'PG' },
            { label: 'Property Category', name: 'category', type: 'text', visibleIf: (data) => data.listingType !== 'PG' },
            { label: 'Property Type', name: 'propertyType', type: 'text', visibleIf: (data) => data.listingType !== 'PG' },
            { label: 'BHK Configuration', name: 'bhk', type: 'text', visibleIf: (data, isVisible) => data.listingType !== 'PG' && isVisible('bhk') },
            { label: 'Carpet Area', name: 'carpetArea', type: 'area', visibleIf: (data, isVisible) => data.listingType !== 'PG' && isVisible('carpetArea') },
            { label: 'Super Built-up Area', name: 'superArea', type: 'area', visibleIf: (data, isVisible) => data.listingType !== 'PG' && isVisible('superArea') },
            { label: 'Floor Number', name: 'floorNumber', type: 'text', visibleIf: (data, isVisible) => data.listingType !== 'PG' && isVisible('floorNumber') },
            { label: 'Total Floors', name: 'totalFloors', type: 'text', visibleIf: (data, isVisible) => data.listingType !== 'PG' && isVisible('totalFloors') },
            { label: 'Property Age', name: 'propertyAge', type: 'text', visibleIf: (data, isVisible) => data.listingType !== 'PG' && isVisible('propertyAge') },
            { label: 'Facing', name: 'facing', type: 'text', visibleIf: (data, isVisible) => data.listingType !== 'PG' && isVisible('facing') },
            { label: 'Furnishing Status', name: 'furnishingStatus', type: 'text', visibleIf: (data, isVisible) => data.listingType !== 'PG' && isVisible('furnishingStatus') },
            { label: 'Availability Status', name: 'availabilityStatus', type: 'text', visibleIf: (data, isVisible) => data.listingType !== 'PG' && isVisible('availabilityStatus') },
            { label: 'Amenities', name: 'amenities', type: 'array', visibleIf: (data, isVisible) => data.listingType !== 'PG' && isVisible('amenities') },
        ]
    },
    {
        sectionId: 'location',
        title: 'Location',
        stepIndex: 2,
        fields: [
            { label: 'Full Address', name: 'address', type: 'text', visibleIf: () => true },
            { label: 'City', name: 'city', type: 'text', visibleIf: () => true },
            { label: 'State', name: 'state', type: 'text', visibleIf: () => true },
            { label: 'Country', name: 'country', type: 'text', visibleIf: () => true },
            { label: 'Pincode', name: 'pincode', type: 'text', visibleIf: () => true },
            { label: 'Locality / Area', name: 'locality', type: 'text', visibleIf: () => true },
            { label: 'Sub-locality / Street', name: 'subLocality', type: 'text', visibleIf: () => true },
            { label: 'Landmark', name: 'landmark', type: 'text', visibleIf: () => true },
            { label: 'Nearby Facilities', name: 'nearbyFacilities', type: 'array', visibleIf: () => true },
        ]
    },
    {
        sectionId: 'sellDetails',
        title: 'Sell Details',
        stepIndex: 3,
        visibleIfSection: (data) => data.listingType === 'Sell',
        fields: [
            { label: 'Property Ownership', name: 'propertyOwnership', type: 'text', visibleIf: () => true },
            { label: 'Possession Date', name: 'possessionDate', type: 'date', visibleIf: () => true },
            { label: 'Expected Price', name: 'expectedPrice', type: 'currency', visibleIf: () => true },
            { label: 'Booking Amount', name: 'bookingAmount', type: 'currency', visibleIf: () => true },
            { label: 'Property Tax', name: 'propertyTax', type: 'currency', visibleIf: () => true },
            { label: 'Price Per Sq.Ft', name: 'pricePerSqft', type: 'currency', visibleIf: (data) => !!data.pricePerSqft },
        ]
    },
    {
        sectionId: 'rentDetails',
        title: 'Rent Details',
        stepIndex: 3,
        visibleIfSection: (data) => data.listingType === 'Rent',
        fields: [
            { label: 'Monthly Rent', name: 'monthlyRent', type: 'currency', visibleIf: () => true },
            { label: 'Security Deposit', name: 'securityDeposit', type: 'currency', visibleIf: () => true },
            { label: 'Available From', name: 'availableFrom', type: 'date', visibleIf: () => true },
            { label: 'Maintenance Included', name: 'maintenanceIncluded', type: 'text', visibleIf: () => true },
            { label: 'Electricity Charges', name: 'electricityCharges', type: 'text', visibleIf: () => true },
            { label: 'Water Charges', name: 'waterCharges', type: 'text', visibleIf: () => true },
            { label: 'Preferred Tenants', name: 'preferredTenant', type: 'text', visibleIf: () => true },
            { label: 'Furnishing Status', name: 'furnishingStatus', type: 'text', visibleIf: () => true },
            { label: 'Availability Status', name: 'availabilityStatus', type: 'text', visibleIf: () => true },
            { label: 'Occupancy Status', name: 'occupancyStatus', type: 'text', visibleIf: () => true },
        ]
    },
    {
        sectionId: 'pgDetails',
        title: 'PG Details',
        stepIndex: 3,
        visibleIfSection: (data) => data.listingType === 'PG',
        fields: [
            { label: 'Rent Per Bed', name: 'rentPerBed', type: 'currency', suffix: '/ month', visibleIf: () => true },
            { label: 'Security Deposit', name: 'securityDepositPG', type: 'currency', visibleIf: () => true },
            { label: 'Sharing Type', name: 'sharingType', type: 'text', visibleIf: () => true },
            { label: 'Total Beds', name: 'totalBeds', type: 'text', visibleIf: () => true },
            { label: 'Available Beds', name: 'availableBeds', type: 'text', visibleIf: () => true },
            { label: 'Bed Type', name: 'bedType', type: 'text', visibleIf: () => true },
            { label: 'Attached Bathroom', name: 'attachedBathroom', type: 'text', visibleIf: () => true },
            { label: 'Electricity Included', name: 'electricityIncludedPG', type: 'text', visibleIf: () => true },
            { label: 'Water Included', name: 'waterIncludedPG', type: 'text', visibleIf: () => true },
            { label: 'Food Provided', name: 'foodIncluded', type: 'text', visibleIf: () => true },
            { label: 'Food Type', name: 'foodType', type: 'text', visibleIf: (data) => data.foodIncluded === 'Yes' },
            { label: 'Gate Closing Time', name: 'gateClosingTime', type: 'text', visibleIf: () => true },
            { label: 'Visitor Allowed', name: 'visitorAllowed', type: 'text', visibleIf: () => true },
            { label: 'Warden Available', name: 'wardenAvailable', type: 'text', visibleIf: () => true },
        ]
    },
    {
        sectionId: 'verification',
        title: 'Verification',
        stepIndex: 4,
        fields: [
            { label: 'Government ID', name: 'govtId', type: 'file', visibleIf: () => true },
            { label: 'Ownership Proof', name: 'ownershipProof', type: 'file', visibleIf: () => true },
            { label: 'Geo Tag Confirmed', name: 'geoTagConfirmed', type: 'boolean', visibleIf: () => true },
        ]
    }
];
