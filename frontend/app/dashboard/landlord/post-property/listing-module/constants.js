import {
    Zap, ArrowUp, Dumbbell, Droplets, Shield, Car, Coffee, Wifi,
    Monitor, Users, Fan, TreePine, ChefHat, LayoutGrid
} from 'lucide-react';

export const INITIAL_STATE = {
    // 1. BASIC INFORMATION
    title: '',
    category: 'Residential', // Residential, Commercial
    propertyType: 'Flat', // Flat, Villa, Plot, Office, Shop
    listingType: 'Sell', // Sell, Rent, PG
    bhk: '2 BHK',
    builtUpArea: '',
    carpetArea: '',
    superArea: '',
    floorNumber: '',
    totalFloors: '',
    propertyAge: 'New Construction',
    facing: 'East',
    furnishingStatus: 'Semi-Furnished',
    availabilityStatus: 'Ready to Move',

    // 2. LOCATION DETAILS
    country: 'India',
    state: '',
    city: '',
    locality: '',
    subLocality: '',
    landmark: '',
    address: '',
    pincode: '',
    latitude: '',
    longitude: '', // Optional
    nearbyFacilities: [], // Array of strings

    // 3. PRICING DETAILS
    expectedPrice: '',
    maintenanceAmount: '',
    maintenanceFrequency: 'Monthly',
    bookingAmount: '',
    tokenAmount: '',
    propertyTax: '', // Optional

    // 4. SELL SPECIFIC DETAILS
    ownershipType: 'Freehold',
    propertyOwnership: 'First Owner',
    encumbranceStatus: 'No',
    reraApproved: 'No',
    reraRegistrationNumber: '',
    approvalAuthority: '',
    possessionDate: '',
    societyName: '',
    propertyId: '',

    // Financial Details
    homeLoanAvailable: 'No',
    bankApprovedBy: '',
    emiEstimate: '',
    stampDuty: '',
    registrationCost: '',

    // Plot Specific
    plotArea: '',
    plotLength: '',
    plotWidth: '',
    cornerPlot: 'No',
    gatedCommunity: 'No',

    // 5. RENT SPECIFIC DETAILS (Sprint 4)
    monthlyRent: '',
    securityDeposit: '',
    leaseDuration: '',
    lockinPeriod: '',
    rentNoticePeriod: '',
    rentIncrementClause: 'No',
    maintenanceIncluded: 'No',
    electricityCharges: 'Separate',
    waterCharges: 'Included',

    // Tenant Preferences
    preferredTenant: [],
    nonVegAllowed: 'Yes',
    petsAllowed: 'No',
    smokingAllowed: 'No',
    workingProfessionalsOnly: 'No',

    // Availability
    availableFrom: '',
    visitingHours: '',
    occupancyStatus: 'Vacant',

    // 6. PG / HOSTEL SPECIFIC DETAILS (Sprint 5)
    // Room Details
    sharingType: 'Double',
    totalRooms: '',
    totalBeds: '',
    availableBeds: '',
    bedType: 'Single',
    attachedBathroom: 'No',
    acRoom: 'No',
    balcony: 'No',

    // Pricing Model
    rentPerBed: '',
    securityDepositPG: '',
    electricityIncludedPG: 'Yes',
    waterIncludedPG: 'Yes',
    foodIncluded: 'No',
    foodType: 'Veg',
    laundryIncluded: 'No',
    housekeepingIncluded: 'Yes',

    // House Rules
    curfewTime: '',
    visitorAllowed: 'No',
    gateClosingTime: '',
    idVerificationRequired: 'Yes',
    genderAllowed: 'Co-Living',

    // Safety Features
    cctvPG: 'Yes',
    biometricEntry: 'No',
    wardenAvailable: 'No',
    fireSafety: 'Yes',
    powerBackupPG: 'Yes',
    emergencyContact: '',


    // 7. AMENITIES
    amenities: [],

    // 8. MEDIA
    coverImage: null,
    images: [],
    videoUrl: '',
    tour360Url: '',
    floorPlan: null,
    brochure: null,

    // 9. OWNER DETAILS
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    role: 'Owner',
    reraNumber: '',

    // 10. VERIFICATION & TRUST (Sprint 6)
    // Identity Verification (UI)
    govtId: null, // File
    selfie: null, // File

    // Property Proof (UI)
    ownershipProof: null, // File
    utilityBill: null, // File
    propertyDocuments: [], // Array of files

    // Geo Verification (UI)
    geoTagConfirmed: false, // Checkbox

    // Hidden / System Fields (State only)
    mobileVerified: false,
    emailVerified: false,
    liveLocationVerified: false,

    // Admin Metadata (Hidden)
    listingStatus: 'draft',
    verificationStatus: 'unverified',
    fraudRiskScore: 0,
    duplicateFlag: false,
    adminNotes: '',
    listingScore: 0,
    expiryDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),

    // Legacy/Unused fields cleanup (kept if referenced elsewhere temporarily)
    roomType: [],
    genderPreference: 'Anyone',
    foodOptions: [],
    noticePeriod: '1 Month'
};

export const AMENITIES_LIST = [
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'lift', label: 'Lift', icon: ArrowUp },
    { id: 'power_backup', label: 'Power Backup', icon: Zap },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'cctv', label: 'CCTV', icon: Shield },
    { id: 'gym', label: 'Gym', icon: Dumbbell },
    { id: 'pool', label: 'Swimming Pool', icon: Droplets },
    { id: 'club_house', label: 'Clubhouse', icon: Users },
    { id: 'garden', label: 'Garden', icon: TreePine },
    { id: 'balcony', label: 'Balcony', icon: LayoutGrid },
    { id: 'modular_kitchen', label: 'Modular Kitchen', icon: ChefHat },
    { id: 'ac', label: 'AC', icon: Fan },
    { id: 'wardrobe', label: 'Wardrobe', icon: LayoutGrid },
    { id: 'wifi', label: 'Internet/WiFi', icon: Wifi },
];

export const NEARBY_FACILITIES = [
    'Metro Station', 'School', 'Hospital', 'Mall', 'Bus Stop', 'Highway'
];
