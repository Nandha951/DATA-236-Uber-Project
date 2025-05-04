const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
    },
    coordinates: {
        type: [Number],
        required: true
    },
    address: {
        type: String,
        required: true
    }
});

const rideSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    pickup: {
        type: locationSchema,
        required: true
    },
    dropoff: {
        type: locationSchema,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'arrived', 'started', 'completed', 'cancelled'],
        default: 'pending'
    },
    requestTime: {
        type: Date,
        default: Date.now
    },
    acceptTime: {
        type: Date
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    estimatedDuration: {
        type: Number, // in minutes
        required: true
    },
    estimatedDistance: {
        type: Number, // in kilometers
        required: true
    },
    estimatedPrice: {
        type: Number,
        required: true
    },
    actualPrice: {
        type: Number
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'wallet'],
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    feedback: {
        type: String
    },
    cancellationReason: {
        type: String
    },
    cancelledBy: {
        type: String,
        enum: ['user', 'driver', 'system']
    }
}, {
    timestamps: true
});

// Index for geospatial queries
rideSchema.index({ 'pickup.coordinates': '2dsphere' });
rideSchema.index({ 'dropoff.coordinates': '2dsphere' });

// Index for status-based queries
rideSchema.index({ status: 1, requestTime: -1 });

// Methods
rideSchema.methods.calculatePrice = function() {
    const BASE_FARE = 5; // Base fare in dollars
    const PER_KM_RATE = 2; // Rate per kilometer
    const PER_MINUTE_RATE = 0.5; // Rate per minute

    return BASE_FARE + 
           (this.estimatedDistance * PER_KM_RATE) + 
           (this.estimatedDuration * PER_MINUTE_RATE);
};

rideSchema.methods.canBeCancelled = function() {
    return ['pending', 'accepted'].includes(this.status);
};

// Statics
rideSchema.statics.findNearbyRides = async function(coordinates, maxDistance = 5000) {
    return this.find({
        'pickup.coordinates': {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: coordinates
                },
                $maxDistance: maxDistance
            }
        },
        status: 'pending'
    });
};

rideSchema.statics.findActiveRidesForDriver = function(driverId) {
    return this.find({
        driverId,
        status: { $in: ['accepted', 'arrived', 'started'] }
    });
};

rideSchema.statics.findActiveRidesForUser = function(userId) {
    return this.find({
        userId,
        status: { $in: ['pending', 'accepted', 'arrived', 'started'] }
    });
};

const Ride = mongoose.model('Ride', rideSchema);

module.exports = Ride; 