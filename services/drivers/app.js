require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const driverRoutes = require('./routes/driverRoutes');
const cors = require('cors');


const app = express();
connectDB();

const { connectRedis } = require('./redisClient');
connectRedis();

app.use(express.json());
app.use(cors());

app.use('/api/drivers', driverRoutes);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
    console.log(`🧍 Drivers Service running on port ${PORT}`);
});
