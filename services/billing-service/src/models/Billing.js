const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
  billingId: { type: Number, unique: true }, // You'd need to handle auto-increment logic in MongoDB
  customerSsn: { type: String, required: true, ref: 'Customer' },
  paymentMethod: { type: String, required: true },
  billingDate: { type: Date, required: true },
  amount: { type: mongoose.Types.Decimal128, required: true }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

billingSchema.index({ customerSsn: 1 });
billingSchema.index({ billingDate: 1 });

module.exports = mongoose.model('Billing', billingSchema); 