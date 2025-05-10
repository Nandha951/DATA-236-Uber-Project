const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3010;

// Middleware
app.use(cors());
app.use(express.json());

// Import and use admin routes
const adminRoutes = require('./routes/admin.routes');
app.use('/api/admins', adminRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/uber')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'admin-service' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Admin Service is running on port ${PORT}`);
}); 