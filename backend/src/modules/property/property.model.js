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
            enum: ['sell', 'rent', 'pg'],
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
            country: String,
            state: String,
            city: String,
            pincode: String,
            locality: String,
            subLocality: String,
            landmark: String,
            address: String,
            latitude: Number,
            longitude: Number,
            nearbyFacilities: [String]
        },

        /* ---------- PRICING ---------- */
        pricing: {
            expectedPrice: Number,
            monthlyRent: Number,
            securityDeposit: Number,
            bookingAmount: Number,
            propertyTax: Number,
            pricePerSqft: Number,
            maintenanceIncluded: String,
            electricityCharges: String,
            waterCharges: String,
            rentPerBed: Number,
            securityDepositPG: Number,
            electricityIncludedPG: String,
            waterIncludedPG: String
        },

        /* ---------- PROPERTY DETAILS ---------- */
        details: {
            propertyType: String,
            bhk: String,
            bedrooms: Number,
            bathrooms: Number,
            balconies: Number,
            floorNumber: Number,
            totalFloors: Number,
            furnishingStatus: String,
            facing: String,
            superArea: Number,
            carpetArea: Number,
            availabilityStatus: String,
            cabins: Number,
            workstations: Number,
            conferenceRoom: Number,
            pantry: Number,
            washroomsCount: Number,
            parkingCount: Number,
            powerBackup: String,
            entranceWidth: Number,
            ceilingHeight: Number,
            propertyOwnership: String,
            possessionDate: String,
            availableFrom: String,
            occupancyStatus: String,
            visitingHours: String,
            sharingType: String,
            bedType: String,
            availableBeds: Number,
            attachedBathroom: String,
            foodIncluded: String,
            foodType: String,
            gateClosingTime: String,
            visitorAllowed: String,
            wardenAvailable: String,
            roadFacing: String
        },

        /* ---------- MEDIA & VERIFICATION ---------- */
        amenities: [String],
        images: [String],
        coverImage: String,

        verification: {
            govtId: String,
            ownershipProof: String,
            geoTagConfirmed: { type: Boolean, default: false }
        },

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
