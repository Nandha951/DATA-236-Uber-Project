const express = require('express');
const cors = require('cors'); // Import the cors package
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import configurations
const initializeMySQL = require('./config/mysql');
const initializeMongoDB = require('./config/mongodb');
const { initializeRedis } = require('./config/redis');
const { initializeKafka } = require('./config/kafka');

// Import routes (to be created)
const driverRoutes = require('./routes/driver.routes');
const customerRoutes = require('./routes/customer.routes');
const rideRoutes = require('./routes/ride.routes');
const billingRoutes = require('./routes/billing.routes');
const adminRoutes = require('./routes/admin.routes');

// Import middleware
const errorHandler = require('./middleware/error.middleware');
const notFoundHandler = require('./middleware/notFound.middleware');

const app = express();

// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Enable JSON parsing

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(morgan('dev')); // Request logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use('/api/drivers', driverRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize all services


const { consumer } = require('./config/kafka');

// Connect and subscribe to Kafka topic before initializing services
const connectAndSubscribeKafka = async () => {
    try {
        await consumer.connect();
        await consumer.subscribe({ topic: 'ride.requested', fromBeginning: true });
        console.log('Kafka consumer connected and subscribed successfully.');
    } catch (error) {
        console.error('Failed to connect and subscribe Kafka consumer:', error);
        process.exit(1);
    }
};

const initializeServices = async () => {
    try {
        await connectAndSubscribeKafka();
        // Initialize MySQL
        await initializeMySQL();

        // Initialize MongoDB
        await initializeMongoDB();

        // Initialize Redis
        await initializeRedis();

        await initializeKafka();
        await initializeKafka();

        console.log('All services initialized successfully.');
    } catch (error) {
        console.error('Failed to initialize services:', error);
        process.exit(1);
    }
};

// Start the server
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        await connectAndSubscribeKafka();
        await initializeServices();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app; 