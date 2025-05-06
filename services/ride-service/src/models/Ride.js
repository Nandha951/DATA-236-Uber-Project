const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: { type: String, required: true }
}, { _id: false });

const rideSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Customer' },
  driverId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Driver' },
  pickup: { type: locationSchema, required: true },
  dropoff: { type: locationSchema, required: true },
  status: { type: String, enum: ['requested', 'in_progress', 'completed', 'cancelled'], default: 'requested' },
  fare: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('Ride', rideSchema); 