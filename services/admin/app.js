require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const redis = require('redis');
const adminRoutes = require('./routes/adminRoutes'); // ✅ Import your route file

const app = express();
connectDB();
const PORT = process.env.PORT || 4005;

// Middleware
app.use(cors());
app.use(express.json());

// Redis client
const redisClient = redis.createClient({
  url: 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Error:', err);
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected (admin-service)');
});



// ✅ MOUNT ALL ROUTES
app.use('/api/admin', adminRoutes); // this enables /api/admin/signup, /drivers, etc.

// ✅ Start the Server
app.listen(PORT, () => {
  console.log(`Admin Service running on port ${PORT}`);

});