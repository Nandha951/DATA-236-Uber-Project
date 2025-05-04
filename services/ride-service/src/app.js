const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { Server } = require('socket.io');
const http = require('http');
require('dotenv').config();

// Import configurations
const initializeMongoDB = require('./config/mongodb');
const { initializeRedis } = require('./config/redis');
const appConfig = require('./config/appConfig');

// Import routes
const rideRoutes = require('./routes/ride.routes');

// Import middleware
const errorHandler = require('./middleware/error.middleware');
const notFoundHandler = require('./middleware/notFound.middleware');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

// Middleware setup
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Handle driver location updates
    socket.on('driver:location', (data) => {
        // Broadcast driver location to relevant clients
        io.emit(`ride:${data.rideId}:location`, data);
    });

    // Handle ride status updates
    socket.on('ride:status', (data) => {
        // Broadcast ride status to relevant clients
        io.emit(`ride:${data.rideId}:status`, data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Root route for service health check
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Ride Service is running',
        endpoints: {
            rides: '/api/rides'
        }
    });
});

// Routes
app.use('/api/rides', rideRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
    console.log('Starting Ride Service initialization...');
    try {
        // Initialize MongoDB
        console.log('Initializing MongoDB...');
        await initializeMongoDB();
        console.log('MongoDB initialized successfully');

        // Initialize Redis
        console.log('Initializing Redis...');
        await initializeRedis();
        console.log('Redis initialized successfully');

        // Start listening only if not in test environment
        if (process.env.NODE_ENV !== 'test') {
            const PORT = process.env.PORT || 3002;
            server.listen(PORT, () => {
                console.log(`Ride Service is running on port ${PORT}`);
            });
        }
    } catch (error) {
        console.error('Failed to initialize the Ride Service:', error);
        if (process.env.NODE_ENV !== 'test') {
            process.exit(1);
        }
    }
}

// Start the server
startServer();

module.exports = { app, server, io }; 