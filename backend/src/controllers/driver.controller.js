const { Driver } = require('../models/associations');
const { redisClient } = require('../config/redis');
const DriverMedia = require('../models/mongodb/DriverMedia');

// GET all drivers
exports.getAllDrivers = async (req, res) => {
    const cacheKey = 'drivers:all';

    try {
        // Try to get the data from the Redis cache
        const cachedDrivers = await redisClient.get(cacheKey);

        if (cachedDrivers) {
            // If the data is in the cache, return it
            console.log('Data retrieved from Redis cache');
            return res.status(200).json(JSON.parse(cachedDrivers));
        }

        // If the data is not in the cache, query the database
        const drivers = await Driver.findAll();

        // Store the data in the Redis cache
        await redisClient.set(cacheKey, JSON.stringify(drivers), {
            EX: 60, // Set the cache expiration time to 60 seconds
        });

        console.log('Data retrieved from database and stored in Redis cache');
        res.status(200).json(drivers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET a driver by SSN
exports.getDriverBySsn = async (req, res) => {
    try {
        const driver = await Driver.findByPk(req.params.ssn);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
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