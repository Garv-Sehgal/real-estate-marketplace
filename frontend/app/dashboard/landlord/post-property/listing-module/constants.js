import {
    Zap, ArrowUp, Dumbbell, Droplets, Shield, Car, Coffee, Wifi,
    Monitor, Users, Fan, TreePine, ChefHat, LayoutGrid, Thermometer,
    Refrigerator, WashingMachine, Tv
} from 'lucide-react';

export const INITIAL_STATE = {
    // 1. BASIC INFORMATION
    title: '',
    category: 'Residential', // Residential, Commercial
    propertyType: 'Flat', // Flat, Villa, Plot, Office, Shop
    listingType: 'Sell', // Sell, Rent, PG
    bhk: '2 BHK',
    carpetArea: '',
    superArea: '',
    floorNumber: '',
    totalFloors: '',
    propertyAge: 'New Construction',
    facing: 'East',
    furnishingStatus: 'Semi-Furnished',
    availabilityStatus: 'Ready to Move',
    basicInfoMedia: [],
    coverImage: '',
    amenities: [],

    // Commercial Office specific fields
    cabins: '',
    workstations: '',
    conferenceRoom: false,
    pantry: false,
    washroomsCount: '',
    parkingCount: '',
    powerBackup: '',

    // Commercial Shop specific fields
    locatedIn: '',
    entranceWidth: '',
    roadFacing: 'No',
    parkingAvailability: 'No',

    // Commercial Showroom specific fields
    ceilingHeight: '',
    loadingAccess: 'No',
    powerLoadCapacity: '',



    // 2. LOCATION DETAILS
    country: 'IN',
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
    propertyTax: '', // Optional

    // 4. SELL SPECIFIC DETAILS
    propertyOwnership: 'First Owner',
    possessionDate: '',

    // Commercial Office Sell Specific
    propertyAge: '',
    titleClear: '',
    activeLoan: '',
    outstandingLoanAmount: '',
    priceNegotiable: '',
    monthlyMaintenanceCharges: '',
    brokerageApplicable: '',
    brokerageAmount: '',

    // Financial Details Removed


    // 5. RENT SPECIFIC DETAILS (Sprint 4)
    monthlyRent: '',
    securityDeposit: '',
    maintenanceIncluded: 'No',
    electricityCharges: 'Separate',
    waterCharges: 'Included',

    // Tenant Preferences
    preferredTenant: 'Anyone',

    // Availability
    availableFrom: '',
    visitingHours: '',
    occupancyStatus: 'Vacant',

    // Commercial Office Rent Specific
    lockInPeriod: '',
    leaseDuration: '',

    // 6. PG / HOSTEL SPECIFIC DETAILS (Sprint 5)
    // Room Details
    sharingType: 'Double',
    totalBeds: '',
    availableBeds: '',
    bedType: 'Single',
    attachedBathroom: 'No',

    // Pricing Model
    rentPerBed: '',
    securityDepositPG: '',
    waterIncludedPG: 'Yes',
    foodIncluded: 'No',
    foodType: 'Veg',

    // House Rules
    visitorAllowed: 'No',
    gateClosingTime: '',
    wardenAvailable: 'No',
    genderAllowed: 'For All',



    // 10. VERIFICATION & TRUST (Sprint 6)
    // Identity Verification (UI)
    govtId: null, // File
    ownershipProof: null, // File

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
    genderPreference: 'For All',
    foodOptions: [],
    noticePeriod: '1 Month'
};

export const AMENITIES_LIST = [
    // 🔥 Essential / Most Searched
    { id: 'power_backup', label: 'Power Backup', icon: Zap },
    { id: 'water_supply', label: '24x7 Water Supply', icon: Droplets },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'cctv', label: 'CCTV Surveillance', icon: Shield },
    { id: 'wifi', label: 'Internet/WiFi', icon: Wifi },
    { id: 'ac', label: 'Air Conditioning (AC)', icon: Fan },

    // ⚖️ Highly Important Appliances
    { id: 'refrigerator', label: 'Refrigerator', icon: Refrigerator },
    { id: 'washing_machine', label: 'Washing Machine', icon: WashingMachine },
    { id: 'tv', label: 'Television', icon: Tv },
    { id: 'geyser', label: 'Geyser (Hot Water)', icon: Thermometer },

    // ⚖️ Comfort & Utility
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'lift', label: 'Lift', icon: ArrowUp },
    { id: 'wardrobe', label: 'Wardrobe', icon: LayoutGrid },
    { id: 'balcony', label: 'Balcony', icon: LayoutGrid },
    { id: 'modular_kitchen', label: 'Modular Kitchen', icon: ChefHat },

    // 🏢 Lifestyle / Premium
    { id: 'gym', label: 'Gym', icon: Dumbbell },
    { id: 'club_house', label: 'Clubhouse', icon: Users },
    { id: 'garden', label: 'Garden', icon: TreePine },
    { id: 'pool', label: 'Swimming Pool', icon: Droplets },
];

export const COMMERCIAL_AMENITIES = [
    'power_backup', 'security', 'cctv', 'wifi', 'ac', 'parking', 'lift'
];

export const NEARBY_FACILITIES = [
    'Metro Station', 'School', 'Hospital', 'Mall', 'Bus Stop', 'Highway', 'college', 'super-market', 'station', 'Atm', 'Bank', 'Petrol-pump'
];
