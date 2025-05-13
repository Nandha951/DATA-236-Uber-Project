const axios = require('axios');
const Driver = require('../models/driver');
const { client } = require('../redisClient'); // ✅ Redis client

// Helper
const validateSSN = ssn => {
    const ssnRegex = /^(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0000)\d{4}$/;
    return ssnRegex.test(ssn);
};

// Signup
exports.signup = async (req, res) => {
    try {
        const { driverId, password, carDetails, currentLocation, insuranceDetails, ...driverData } = req.body;

        if (!validateSSN(driverId)) {
            return res.status(400).json({ message: 'Invalid SSN format' });
        }

        const existingDriver = await Driver.findOne({ driverId });
        if (existingDriver) {
            return res.status(400).json({ message: 'Driver already exists' });
        }

        const driver = new Driver({
            driverId,
            password,
            ...driverData,
            carDetails,
            currentLocation,
            insuranceDetails
        });

        await driver.save();

        // ❌ Invalidate search cache
        await client.flushAll();

        const driverResponse = driver.toObject();
        delete driverResponse.password;

        res.status(201).json({ message: 'Driver registered', driver: driverResponse });
    } catch (error) {
  console.error('[Signup Error]', error);
  res.status(400).json({ message: error.message || 'Signup failed', error });
}
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const driver = await Driver.findOne({ email });
        if (!driver) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await driver.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        driver.lastLogin = Date.now();
        await driver.save();

        const driverResponse = driver.toObject();
        delete driverResponse.password;

        res.json({ message: 'Login successful', driver: driverResponse });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CRUD
exports.getAllDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find();
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDriverById = async (req, res) => {
    try {
        const driver = await Driver.findOne({ driverId: req.params.id });
        if (!driver) return res.status(404).json({ message: 'Driver not found' });
        res.json(driver);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateDriver = async (req, res) => {
    try {
        const driver = await Driver.findOneAndUpdate(
            { driverId: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!driver) return res.status(404).json({ message: 'Driver not found' });

        // ❌ Invalidate search cache
        await client.flushAll();

        res.json(driver);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteDriver = async (req, res) => {
    try {
        const driver = await Driver.findOneAndDelete({ driverId: req.params.id });
        if (!driver) return res.status(404).json({ message: 'Driver not found' });

        // ❌ Invalidate search cache
        await client.flushAll();

        res.json({ message: 'Driver deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Search with Redis Caching
exports.searchDrivers = async (req, res) => {
    try {
        const queryKey = `driverSearch:${JSON.stringify(req.query)}`;

        const cached = await client.get(queryKey);
        if (cached) {
            console.log('✅ Redis: returning cached search');
            return res.json(JSON.parse(cached));
        }

        const query = {};
        if (req.query.firstName) query.firstName = new RegExp(req.query.firstName, 'i');
        if (req.query.lastName) query.lastName = new RegExp(req.query.lastName, 'i');
        if (req.query.city) query.city = new RegExp(req.query.city, 'i');
        if (req.query.state) query.state = new RegExp(req.query.state, 'i');
        if (req.query.rating) query.rating = { $gte: parseFloat(req.query.rating) };
        if (req.query.carMake) query['carDetails.make'] = new RegExp(req.query.carMake, 'i');
        if (req.query.carModel) query['carDetails.model'] = new RegExp(req.query.carModel, 'i');

        const drivers = await Driver.find(query);

        await client.setEx(queryKey, 60, JSON.stringify(drivers));
        console.log('⏱️ Redis: cached driver search for 60s');

        res.json(drivers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Videos
exports.addDriverVideo = async (req, res) => {
    try {
        const driver = await Driver.findOne({ driverId: req.params.id });
        if (!driver) return res.status(404).json({ message: 'Driver not found' });

        driver.media.push({
            type: 'video',
            url: req.body.videoUrl,
            uploadDate: new Date()
        });

        await driver.save();
        res.json(driver);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getDriverVideo = async (req, res) => {
    try {
        const driver = await Driver.findOne({ driverId: req.params.id });
        if (!driver) return res.status(404).json({ message: 'Driver not found' });

        const videos = driver.media.filter(media => media.type === 'video');
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Nearby Drivers
exports.getNearbyDrivers = async (req, res) => {
    try {
        const { latitude, longitude } = req.query;
        if (!latitude || !longitude) return res.status(400).json({ message: 'Latitude and longitude are required' });

        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);
        if (isNaN(lat) || isNaN(lon)) return res.status(400).json({ message: 'Invalid coordinates' });

        const allDrivers = await Driver.find();

        const filteredDrivers = allDrivers.filter(driver => {
            if (!driver.currentLocation?.latitude || !driver.currentLocation?.longitude) return false;
            const distance = calculateDistance(lat, lon, driver.currentLocation.latitude, driver.currentLocation.longitude);
            return distance <= 10;
        });

        res.json({ drivers: filteredDrivers });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching nearby drivers', error: error.message });
    }
};

// Summary
exports.getDriverSummary = async (req, res) => {
    const { driverId } = req.params;
    try {
        const [ridesRes, billsRes] = await Promise.all([
            axios.get(`http://localhost:4001/api/rides/driver/${driverId}`),
            axios.get(`http://localhost:4004/api/billing/driver/${driverId}`)
        ]);

        const rides = ridesRes.data || [];
        const bills = billsRes.data || [];
        console.log('🚀 Rides data:', rides.map(r => ({
            rideId: r.rideId,
            actualPrice: r.actualPrice,
            estimatedPrice: r.estimatedPrice
          })));
        const summary = {
            totalRides: rides.length,
            completedRides: rides.filter(r => r.status === 'completed').length,
            totalEarnings: bills.reduce((sum, b) => sum + (b.actualPrice || 0), 0),
            rideHistory: rides.map(r => ({
                rideId: r.rideId,
                date: r.dateTime,
                status: r.status,
                fare: r.actualPrice || r.estimatedPrice || 0
            })),
            billHistory: bills.map(b => ({
                billingId: b.billingId,
                date: b.date,
                amount: b.actualPrice,
                status: b.status
            }))
        };

        res.json({ driverId, summary });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch driver summary', error: error.message });
    }
};

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3959;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(degrees) {
    return degrees * (Math.PI / 180);
}



