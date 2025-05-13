require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const billingRoutes = require('./routes/billingRoutes');
const cors = require('cors');

const app = express();
connectDB();

const { connectRedis } = require('./redisClient');
connectRedis();

app.use(express.json());
app.use(cors());
app.use('/api/billing', billingRoutes);

const PORT = process.env.PORT || 4004;
app.listen(PORT, () => {
    console.log(`💳 Billing Service running on port ${PORT}`);
});
