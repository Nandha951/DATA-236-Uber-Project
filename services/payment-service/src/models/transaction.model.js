const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['CREDIT', 'DEBIT'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'USD'
    },
    status: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'FAILED'],
        default: 'PENDING'
    },
    rideId: {
        type: String,
        index: true
    },
    paymentMethod: {
        type: String,
        enum: ['CARD', 'WALLET', 'BANK_TRANSFER'],
        required: true
    },
    description: String,
    metadata: {
        type: Map,
        of: String
    }
}, {
    timestamps: true
});

// Indexes
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Transaction', transactionSchema); 