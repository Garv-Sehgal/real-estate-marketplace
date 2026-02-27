const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
{
    id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    ownerId: {
        type: String,
        required: true,
        index: true
    },

    // residential | commercial
    category: {
        type: String,
        enum: ['residential', 'commercial'],
        required: true
    },

    // sell | rent | pg
    listingType: {
        type: String,
        enum: ['sell','rent','pg'],
        required: true
    },

    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        default: ''
    },

    /* ---------- LOCATION ---------- */
    location: {
        city: String,
        address: String,
        latitude: Number,
        longitude: Number
    },

    /* ---------- PRICING ---------- */
    pricing: {
        expectedPrice: Number,      // sell
        monthlyRent: Number,        // rent
        rentPerBed: Number,         // pg
        securityDeposit: Number,
        pricePerSqft: Number
    },

    /* ---------- PROPERTY DETAILS ---------- */
    details: {
        builtUpArea: Number,
        carpetArea: Number,
        floor: Number,
        totalFloors: Number,

        // residential
        bedrooms: Number,
        bathrooms: Number,
        balconies: Number,
        furnishing: String,

        // commercial
        cabinCount: Number,
        meetingRooms: Number,
        parkingSpots: Number
    },

    amenities: [String],
    images: [String],

    review: {
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'changes_requested'],
            default: 'pending',
            index: true
        },
        message: {
            type: String,
            default: ''
        },
        reviewedBy: String,
        reviewedAt: Date
    }

},
{ timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);
