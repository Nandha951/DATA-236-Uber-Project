const mongoose = require('mongoose');

const RideMediaSchema = new mongoose.Schema({
    rideId: {
        type: Number, // Reference to Ride's rideId in MySQL
        required: true
    },
    imageUrl: {
        type: String
    },
    description: {
        type: String
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('RideMedia', RideMediaSchema);