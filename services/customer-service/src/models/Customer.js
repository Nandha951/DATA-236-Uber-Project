const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
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

  creditCard: {
    cardNumber: { type: String },
    expiry: { type: String },
    cvv: { type: String }
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  
  password: { type: String, required: true },

  reviews: [
    {
      rideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride' },
      comment: String,
      date: { type: Date, default: Date.now }
    }
  ],
  
  zip: {
    type: String,
    required: true,
    match: /^\d{5}$/
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

customerSchema.index({ firstName: 1, lastName: 1 });
customerSchema.index({ state: 1, city: 1 });

module.exports = mongoose.model('Customer', customerSchema); 