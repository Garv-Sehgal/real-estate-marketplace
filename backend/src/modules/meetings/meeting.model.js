const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema(
    {
        propertyId: {
            type: String,
            required: true,
            index: true
        },
        propertyTitle: {
            type: String,
            default: ''
        },
        requesterId: {
            type: String,
            required: true,
            index: true
        },
        requesterName: {
            type: String,
            default: 'Unknown'
        },
        requesterEmail: {
            type: String,
            default: ''
        },
        requesterPhone: {
            type: String,
            default: ''
        },
        ownerId: {
            type: String,
            required: true,
            index: true
        },
        preferredDate: {
            type: String,
            required: true
        },
        preferredTime: {
            type: String,
            default: ''
        },
        message: {
            type: String,
            default: ''
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'rejected'],
            default: 'pending'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Meeting', meetingSchema);
