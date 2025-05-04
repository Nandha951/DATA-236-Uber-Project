const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    driverId: {
        type: String,
        required: true,
        index: true
    },
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    licensePlate: {
        type: String,
        required: true,
        unique: true
    },
    registrationNumber: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['SEDAN', 'SUV', 'VAN', 'LUXURY'],
        required: true
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'MAINTENANCE', 'INACTIVE'],
        default: 'ACTIVE'
    },
    documents: [{
        type: {
            type: String,
            enum: ['REGISTRATION', 'INSURANCE', 'INSPECTION'],
            required: true
        },
        url: String,
        expiryDate: Date,
        status: {
            type: String,
            enum: ['VALID', 'EXPIRED', 'PENDING'],
            default: 'PENDING'
        }
    }]
}, {
    timestamps: true
});

// Indexes
vehicleSchema.index({ type: 1, status: 1 });
vehicleSchema.index({ licensePlate: 1 }, { unique: true });

module.exports = mongoose.model('Vehicle', vehicleSchema); 