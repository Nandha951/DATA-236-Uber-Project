const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import configurations
const initializeMongoDB = require('./config/mongodb');
const appConfig = require('./config/appConfig');

// Import routes
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');

// Import middleware
const errorHandler = require('./middleware/error.middleware');
const notFoundHandler = require('./middleware/notFound.middleware');

const app = express();

// Middleware setup
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route for service health check
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'User Service is running',
        endpoints: {
            users: '/api/users',
            auth: '/api/auth'
        }
    });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
    console.log('Starting User Service initialization...');
    try {
        // Initialize MongoDB
        console.log('Initializing MongoDB...');
        await initializeMongoDB();
        console.log('MongoDB initialized successfully');

        // Start listening
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => {
            console.log(`User Service is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to initialize the User Service:', error);
        process.exit(1);
    }
}

// Start the server
startServer();

module.exports = app; 