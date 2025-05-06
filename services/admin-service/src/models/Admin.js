const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  adminId: { type: Number, unique: true }, // You'd need to handle auto-increment logic in MongoDB
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

adminSchema.index({ firstName: 1, lastName: 1 });

module.exports = mongoose.model('Admin', adminSchema); 