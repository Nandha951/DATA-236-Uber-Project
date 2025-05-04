const Driver = require('../models/driver.model');
const Vehicle = require('../models/vehicle.model');

exports.registerDriver = async (req, res) => {
    try {
        const {
            licenseNumber,
            licenseExpiry,
            vehicleDetails
        } = req.body;

        // Check if driver already exists
        const existingDriver = await Driver.findOne({ userId: req.user.id });
        if (existingDriver) {
            return res.status(400).json({
                status: 'error',
                message: 'Driver already registered'
            });
        }

        // Create vehicle first
        const vehicle = await Vehicle.create({
            driverId: req.user.id,
            ...vehicleDetails
        });

        // Create driver profile
        const driver = await Driver.create({
            userId: req.user.id,
            licenseNumber,
            licenseExpiry,
            vehicleId: vehicle._id,
            status: 'PENDING'
        });

        res.status(201).json({
            status: 'success',
            data: {
                driver,
                vehicle
            }
        });
    } catch (error) {
        console.error('Error registering driver:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to register driver',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
};

exports.getDriverProfile = async (req, res) => {
    try {
        const driver = await Driver.findOne({ userId: req.user.id })
            .populate('vehicleId');

        if (!driver) {
            return res.status(404).json({
                status: 'error',
                message: 'Driver profile not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: driver
        });
    } catch (error) {
        console.error('Error fetching driver profile:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch driver profile',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
};

exports.updateDriverProfile = async (req, res) => {
    try {
        const driver = await Driver.findOneAndUpdate(
            { userId: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!driver) {
            return res.status(404).json({
                status: 'error',
                message: 'Driver profile not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: driver
        });
    } catch (error) {
        console.error('Error updating driver profile:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to update driver profile',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
};

exports.updateDriverStatus = async (req, res) => {
    try {
        const { status, isAvailable } = req.body;
        const driver = await Driver.findOneAndUpdate(
            { userId: req.user.id },
            { status, isAvailable },
            { new: true }
        );

        if (!driver) {
            return res.status(404).json({
                status: 'error',
                message: 'Driver profile not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: driver
        });
    } catch (error) {
        console.error('Error updating driver status:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to update driver status',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
};

exports.updateDriverLocation = async (req, res) => {
    try {
        const { coordinates } = req.body;
        const driver = await Driver.findOneAndUpdate(
            { userId: req.user.id },
            {
                currentLocation: {
                    type: 'Point',
                    coordinates
                }
            },
            { new: true }
        );

        if (!driver) {
            return res.status(404).json({
                status: 'error',
                message: 'Driver profile not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: driver
        });
    } catch (error) {
        console.error('Error updating driver location:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to update driver location',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
};

exports.getNearbyDrivers = async (req, res) => {
    try {
        const { longitude, latitude, maxDistance = 5000 } = req.query;

        const nearbyDrivers = await Driver.find({
            currentLocation: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: parseInt(maxDistance)
                }
            },
            status: 'ACTIVE',
            isAvailable: true
        }).populate('vehicleId');

        res.status(200).json({
            status: 'success',
            data: nearbyDrivers
        });
    } catch (error) {
        console.error('Error fetching nearby drivers:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch nearby drivers',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
}; 