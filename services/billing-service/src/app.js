const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const redis = require('redis');

const app = express();
const PORT = process.env.PORT || 3011;

// Middleware
app.use(cors());
app.use(express.json());

// Import and use billing routes
const billingRoutes = require('./routes/billing.routes');
app.use('/api/billings', billingRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/uber')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Redis client setup
const redisClient = redis.createClient({ url: process.env.REDIS_URL || 'redis://redis:6379' });
redisClient.connect().then(() => console.log('Redis connected successfully')).catch(console.error);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'billing-service' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Billing Service is running on port ${PORT}`);
});

module.exports = { app, redisClient }; 