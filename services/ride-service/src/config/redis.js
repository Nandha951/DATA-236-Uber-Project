const Redis = require('redis');

let redisClient;

const initializeRedis = async () => {
    try {
        redisClient = Redis.createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379'
        });

        redisClient.on('error', (error) => {
            console.error('Redis Client Error:', error);
        });

        await redisClient.connect();
        console.log('Redis connected successfully');
    } catch (error) {
        console.error('Redis connection error:', error);
        throw error;
    }
};

// Cache driver locations for 30 seconds
const cacheDriverLocation = async (driverId, location) => {
    try {
        await redisClient.set(
            `driver:${driverId}:location`,
            JSON.stringify(location),
            { EX: 30 }
        );
    } catch (error) {
        console.error('Error caching driver location:', error);
    }
};

// Get driver's location from cache
const getDriverLocation = async (driverId) => {
    try {
        const location = await redisClient.get(`driver:${driverId}:location`);
        return location ? JSON.parse(location) : null;
    } catch (error) {
        console.error('Error getting driver location:', error);
        return null;
    }
};

// Cache available drivers in an area
const cacheAvailableDrivers = async (areaId, drivers) => {
    try {
        await redisClient.set(
            `area:${areaId}:drivers`,
            JSON.stringify(drivers),
            { EX: 60 }
        );
    } catch (error) {
        console.error('Error caching available drivers:', error);
    }
};

// Get available drivers in an area from cache
const getAvailableDrivers = async (areaId) => {
    try {
        const drivers = await redisClient.get(`area:${areaId}:drivers`);
        return drivers ? JSON.parse(drivers) : null;
    } catch (error) {
        console.error('Error getting available drivers:', error);
        return null;
    }
};

// Cache ride details for 5 minutes
const cacheRideDetails = async (rideId, rideDetails) => {
    try {
        await redisClient.set(
            `ride:${rideId}`,
            JSON.stringify(rideDetails),
            { EX: 300 }
        );
    } catch (error) {
        console.error('Error caching ride details:', error);
    }
};

// Get ride details from cache
const getRideDetails = async (rideId) => {
    try {
        const rideDetails = await redisClient.get(`ride:${rideId}`);
        return rideDetails ? JSON.parse(rideDetails) : null;
    } catch (error) {
        console.error('Error getting ride details:', error);
        return null;
    }
};

module.exports = {
    initializeRedis,
    cacheDriverLocation,
    getDriverLocation,
    cacheAvailableDrivers,
    getAvailableDrivers,
    cacheRideDetails,
    getRideDetails,
    redisClient
}; 