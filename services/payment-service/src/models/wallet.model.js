const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    balance: {
        type: Number,
        default: 0,
        min: 0
    },
    currency: {
        type: String,
        default: 'USD'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Wallet', walletSchema); 