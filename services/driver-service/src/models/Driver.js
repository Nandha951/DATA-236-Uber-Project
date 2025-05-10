const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  ssn: {
    type: String,
    required: true,
    unique: true,
    match: /^\d{3}-?\d{2}-?\d{4}$/ // SSN format validation
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/ // Basic email validation
  },
  phone: { type: String, required: true, maxlength: 15 },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: {
    type: String,
    required: true,
    enum: [
      'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
    ]
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },

  zip: {
    type: String,
    required: true,
    match: /^\d{5}$/
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  vehicleMake: { type: String, required: true },
  vehicleModel: { type: String, required: true },
  vehicleYear: { type: Number, required: true }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

driverSchema.index({ firstName: 1, lastName: 1 });
driverSchema.index({ state: 1, city: 1 });

module.exports = mongoose.model('Driver', driverSchema); 
driverSchema.index({ location: '2dsphere' });