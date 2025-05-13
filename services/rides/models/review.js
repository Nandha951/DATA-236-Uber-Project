const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  rideId: { type: String, required: true },
  reviewerId: { type: String, required: true },
  reviewerType: { type: String, enum: ['customer', 'driver'], required: true },
  revieweeId: { type: String, required: true },
  revieweeType: { type: String, enum: ['customer', 'driver'], required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);