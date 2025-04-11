const mongoose = require('mongoose');

const DriverMediaSchema = new mongoose.Schema({
    driverSsn: {
        type: String, // Reference to Driver's SSN in MySQL
        required: true,
        unique: true
    },
    imageUrl: {
        type: String
    },
    videoUrl: {
        type: String
    },
    bio: {
        type: String
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('DriverMedia', DriverMediaSchema);