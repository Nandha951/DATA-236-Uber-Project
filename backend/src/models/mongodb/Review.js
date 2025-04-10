const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    rideId: {
        type: Number, // Reference to Ride's rideId in MySQL
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String
    },
    customerSsn: {
        type: String, // Reference to Customer's SSN in MySQL
        required: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Review', ReviewSchema);