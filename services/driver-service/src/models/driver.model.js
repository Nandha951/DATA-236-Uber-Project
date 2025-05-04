const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'ACTIVE', 'INACTIVE', 'SUSPENDED'],
        default: 'PENDING'
    },
    licenseNumber: {
        type: String,
        required: true,
        unique: true
    },
    licenseExpiry: {
        type: Date,
        required: true
    },
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle'
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalRides: {
        type: Number,
        default: 0
    },
    documents: [{
        type: {
            type: String,
            enum: ['LICENSE', 'INSURANCE', 'REGISTRATION', 'BACKGROUND_CHECK'],
            required: true
        },
        url: String,
        status: {
            type: String,
            enum: ['PENDING', 'APPROVED', 'REJECTED'],
            default: 'PENDING'
        },
        expiryDate: Date
    }],
    currentLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
    isAvailable: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Indexes
driverSchema.index({ currentLocation: '2dsphere' });
driverSchema.index({ status: 1, isAvailable: 1 });

module.exports = mongoose.model('Driver', driverSchema); 