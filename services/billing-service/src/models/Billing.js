const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
  billingId: { type: String, required: true, unique: true }, // SSN format
  date: { type: Date, required: true },
  pickupTime: { type: Date, required: true },
  dropoffTime: { type: Date, required: true },
  distanceCovered: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  sourceLocation: { type: String, required: true },
  destinationLocation: { type: String, required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Driver' },
  customerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Customer' }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

billingSchema.index({ customerId: 1 });
billingSchema.index({ date: 1 });

module.exports = mongoose.model('Billing', billingSchema); 