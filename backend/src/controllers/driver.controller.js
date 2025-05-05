const { Driver } = require('../models/associations');
const { redisClient } = require('../config/redis');
const DriverMedia = require('../models/mongodb/DriverMedia');

// GET all drivers
exports.getAllDrivers = async (req, res) => {
    try {
        // First try to get the data directly from the database
        const drivers = await Driver.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });

        // Try to cache the result in Redis if available
        try {
            const cacheKey = 'drivers:all';
            await redisClient.set(cacheKey, JSON.stringify(drivers), {
                EX: 60 // Set the cache expiration time to 60 seconds
            });
            console.log('Data stored in Redis cache');
        } catch (redisError) {
            // Log Redis error but don't fail the request
            console.warn('Redis caching failed:', redisError.message);
        }

        return res.status(200).json({
            status: 'success',
            data: drivers
        });
    } catch (error) {
        console.error('Error fetching drivers:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to fetch drivers',
            error: error.message
        });
    }
};

// GET a driver by SSN
exports.getDriverBySsn = async (req, res) => {
    try {
        const ssn = req.params.ssn;
        const cacheKey = `driver:${ssn}`;

        // Try to get the driver from Redis cache first
        try {
            const cachedDriver = await redisClient.get(cacheKey);
            if (cachedDriver) {
                console.log('Driver data retrieved from Redis cache');
                return res.status(200).json(JSON.parse(cachedDriver));
            }
        } catch (redisError) {
            // Log Redis error but continue with database query
            console.warn('Redis cache error:', redisError.message);
        }

        // If not in cache, get from database
        const driver = await Driver.findByPk(ssn);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        // Store in Redis cache with 1-minute expiration
        try {
            await redisClient.set(cacheKey, JSON.stringify(driver), {
                EX: 60 // 1 minute expiration
            });
            console.log('Driver data stored in Redis cache');
        } catch (redisError) {
            // Log Redis error but don't fail the request
            console.warn('Redis caching failed:', redisError.message);
        }

        res.status(200).json(driver);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// POST a new driver
exports.createDriver = async (req, res) => {
    try {
        const driver = await Driver.create(req.body);
        // Also create a DriverMedia entry in MongoDB
        await DriverMedia.create({ driverSsn: driver.ssn });
        res.status(201).json(driver);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// PUT (update) a driver by SSN
exports.updateDriver = async (req, res) => {
    try {
        const driver = await Driver.findByPk(req.params.ssn);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        await driver.update(req.body);
        res.status(200).json(driver);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// DELETE a driver by SSN
exports.deleteDriver = async (req, res) => {
    try {
        const driver = await Driver.findByPk(req.params.ssn);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        await driver.destroy();
        res.status(204).send(); // No content
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};