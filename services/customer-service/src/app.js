const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3012;

// Environment variables
if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set. Using default secret key.');
}

// Middleware
app.use(cors());
app.use(express.json());

// Import and use customer routes
const customerRoutes = require('./routes/customer.routes');
app.use('/api/customers', customerRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/uber')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'customer-service' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Customer Service is running on port ${PORT}`);
}); 