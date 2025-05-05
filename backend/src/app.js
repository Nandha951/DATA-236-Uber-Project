const express = require('express');
const cors = require('cors'); // Import the cors package
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import configurations
const initializeMySQL = require('./config/mysql');
const initializeMongoDB = require('./config/mongodb');
const { initializeRedis } = require('./config/redis');
const { initializeKafka, consumer } = require('./config/kafka');
const appConfig = require('./config/appConfig');

// Import routes
const driverRoutes = require('./routes/driver.routes');
const customerRoutes = require('./routes/customer.routes');
const rideRoutes = require('./routes/ride.routes');
const billingRoutes = require('./routes/billing.routes');
const adminRoutes = require('./routes/admin.routes');
const metricsRoutes = require('./routes/metrics.routes');

// Import middleware
const errorHandler = require('./middleware/error.middleware');
const notFoundHandler = require('./middleware/notFound.middleware');

const app = express();

// Middleware setup
app.use(helmet()); // Security headers
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(morgan('dev')); // Request logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Root route for API health check
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Uber Simulation API is running',
        endpoints: {
            drivers: '/api/drivers',
            customers: '/api/customers',
            rides: '/api/rides',
            billing: '/api/billing',
            admin: '/api/admin',
            metrics: '/api/metrics'
        }
    });
});

// Routes
app.use('/api/drivers', driverRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/metrics', metricsRoutes);

// Error handling (should be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Keep Kafka connection function separate
const connectAndSubscribeKafka = async () => {
    if (!consumer) {
        console.log('Kafka consumer not initialized (Kafka likely disabled). Skipping subscription.');
        return;
    }
    try {
        await consumer.connect();
        // Add topic subscription logic here if needed, e.g.:
        // await consumer.subscribe({ topic: 'your-topic-name', fromBeginning: true });
        console.log('Kafka consumer connected successfully.'); // Simplified message
        // Add message processing logic here if needed, e.g.:
        // await consumer.run({ eachMessage: async ({ topic, partition, message }) => { ... } });
    } catch (error) {
        console.error('Failed to connect or subscribe Kafka consumer:', error);
        // Decide if this is a fatal error
        // process.exit(1);
    }
};

async function startServer() {
    console.log('Starting server initialization...');
    try {
        // Initialize Base Components (assuming MySQL and MongoDB are always required)
        console.log('Initializing MySQL...');
        await initializeMySQL();
        console.log('Initializing MongoDB...');
        await initializeMongoDB();

        // Conditionally Initialize Redis
        if (appConfig.redisEnabled) {
            console.log('Initializing Redis...');
            await initializeRedis();
        } else {
            console.log('Redis is disabled via config. Skipping initialization.');
        }

        // Conditionally Initialize Kafka (Producer and Consumer)
        if (appConfig.kafkaEnabled) {
            console.log('Initializing Kafka...');
            await initializeKafka(); // Initialize producer
            console.log('Connecting Kafka consumer...');
            await connectAndSubscribeKafka(); // Connect consumer
        } else {
            console.log('Kafka is disabled via config. Skipping initialization.');
        }

        console.log('All enabled services initialized successfully.');

        // ... (rest of setup like routes, middleware AFTER initializations) ...

        // Example: Setup routes after DB connections are ready
        // app.use('/api/users', require('./routes/user.routes'));

        // Start listening
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Failed to initialize the application:', error);
        process.exit(1); // Exit if essential services fail
    }
}

// Start the server
startServer();

// Remove old initialization calls from global scope if they existed
// (The previous grep results showed them within app.js, likely inside a start function already)

// Example: Error handling middleware (should be defined after routes)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app; 