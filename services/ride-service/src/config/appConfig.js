require('dotenv').config();

const appConfig = {
    port: process.env.PORT || 3002,
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/uber-rides',
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    userServiceUrl: process.env.USER_SERVICE_URL || 'http://localhost:3001',
    nodeEnv: process.env.NODE_ENV || 'development',
    pricing: {
        baseFare: 5, // Base fare in dollars
        perKmRate: 2, // Rate per kilometer
        perMinuteRate: 0.5, // Rate per minute
        minimumFare: 10 // Minimum fare for any ride
    },
    matching: {
        maxDistance: 5000, // Maximum distance (in meters) to search for drivers
        maxWaitTime: 300, // Maximum wait time (in seconds) for finding a driver
        maxActiveRides: 1 // Maximum number of active rides a driver can have
    },
    redis: {
        driverLocationTTL: 30, // Time to live for driver location cache (in seconds)
        availableDriversTTL: 60, // Time to live for available drivers cache (in seconds)
        rideDetailsTTL: 300 // Time to live for ride details cache (in seconds)
    }
};

module.exports = appConfig; 