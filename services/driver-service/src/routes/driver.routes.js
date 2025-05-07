const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Driver = require('../models/driver.model');
const jwt = require('jsonwebtoken');
const { redisClient } = require('../config/redis');
const { producer } = require('../config/kafka');
const auth = require('../middleware/auth');
const Ride = require('../models/ride.model');
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');
const { uploadFile, deleteFile, getFile, getFileData, bucket } = require('../utils/gridfs');
const multer = require('multer');

// Middleware to validate request
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Register a new driver
router.post('/register', [
    body('name').trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('phoneNumber').matches(/^\+?[\d\s-]+$/),
    body('licenseNumber').notEmpty(),
    body('vehicleDetails').isObject(),
    body('vehicleDetails.licensePlate').notEmpty()
], validateRequest, async (req, res) => {
    try {
        const driver = new Driver(req.body);
        await driver.save();

        // Publish driver registration event
        await producer.send({
            topic: 'driver-registered',
            messages: [{ value: JSON.stringify(driver) }]
        });

        res.status(201).json({
            status: 'success',
            data: {
                driver: {
                    id: driver._id,
                    name: driver.name,
                    email: driver.email,
                    status: driver.status
                }
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

// Driver login
router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
], validateRequest, async (req, res) => {
    try {
        const { email, password } = req.body;
        const driver = await Driver.findOne({ email });

        if (!driver || !(await driver.comparePassword(password))) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign(
            { id: driver._id, role: 'driver' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Cache driver data
        await redisClient.set(
            `driver:${driver._id}`,
            JSON.stringify(driver),
            'EX',
            3600
        );

        // Get the complete driver data
        const driverData = await Driver.findById(driver._id).select('-password');
        console.log('Login response:', {
            id: driverData._id,
            hasProfileImage: !!(driverData.profileImage && driverData.profileImage.fileId)
        });

        res.json({
            status: 'success',
            data: {
                token,
                driver: driverData
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Update driver location
router.put('/location', auth, async (req, res) => {
    try {
        const { latitude, longitude } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({ message: 'Latitude and longitude are required' });
        }

        const driver = await Driver.findByIdAndUpdate(
            req.driver.id,
            {
                currentLocation: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                }
            },
            { new: true }
        ).select('-password');

        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        res.json(driver);
    } catch (error) {
        console.error('Error updating driver location:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update driver status
router.put('/status', auth, async (req, res) => {
    try {
        const { status } = req.body;

        if (!['online', 'offline', 'busy'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const driver = await Driver.findByIdAndUpdate(
            req.driver.id,
            { status },
            { new: true }
        ).select('-password');

        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        res.json(driver);
    } catch (error) {
        console.error('Error updating driver status:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get nearby drivers
router.get('/nearby', auth, async (req, res) => {
    try {
        const { latitude, longitude, radius = 5000 } = req.query;

        const nearbyDrivers = await Driver.find({
            currentLocation: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: parseInt(radius)
                }
            },
            status: 'available'
        }).select('-password');

        res.json({
            status: 'success',
            data: {
                drivers: nearbyDrivers
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Get driver profile
router.get('/profile', auth, async (req, res) => {
    try {
        const driver = await Driver.findById(req.driver.id).select('-password');
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        console.log('Profile fetch response:', {
            id: driver._id,
            hasProfileImage: !!(driver.profileImage && driver.profileImage.fileId)
        });
        res.json({
            status: 'success',
            data: driver
        });
    } catch (error) {
        console.error('Error fetching driver profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get driver's ride history
router.get('/rides', auth, async (req, res) => {
    try {
        const driver = await Driver.findById(req.driver.id);
        if (!driver) {
            return res.status(404).json({
                status: 'error',
                message: 'Driver not found'
            });
        }

        // Get rides from the database
        const rides = await Ride.find({ driver: driver._id })
            .sort({ createdAt: -1 })
            .populate('passenger', 'name email phoneNumber')
            .lean();

        res.json({
            status: 'success',
            data: rides
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Get driver profile image
router.get('/profile/image/:id', async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id);
        if (!driver || !driver.profileImage || !driver.profileImage.fileId) {
            return res.status(404).json({
                status: 'error',
                message: 'Profile image not found'
            });
        }

        const fileData = await getFileData(driver.profileImage.fileId);
        if (!fileData) {
            return res.status(404).json({
                status: 'error',
                message: 'Profile image not found'
            });
        }

        // Set headers for the image response
        res.set({
            'Content-Type': driver.profileImage.contentType,
            'Content-Length': fileData.length,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Cross-Origin-Resource-Policy': 'cross-origin',
            'Cache-Control': 'public, max-age=31536000' // Cache for 1 year
        });

        res.send(fileData);
    } catch (error) {
        console.error('Error fetching profile image:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to fetch profile image'
        });
    }
});

// Update driver profile
router.put('/profile', auth, upload, async (req, res) => {
    try {
        console.log('Profile update request received:', {
            hasFile: !!req.file,
            body: req.body
        });

        const { name, phoneNumber, vehicleDetails } = req.body;
        const updateData = {};

        const driver = await Driver.findById(req.driver.id);
        if (!driver) {
            return res.status(404).json({
                status: 'error',
                message: 'Driver not found'
            });
        }

        // Handle profile image upload using GridFS
        if (req.file) {
            try {
                console.log('Processing profile image upload with GridFS:', {
                    originalname: req.file.originalname,
                    mimetype: req.file.mimetype,
                    size: req.file.size
                });

                // If there's an old image, delete it from GridFS
                if (driver.profileImage && driver.profileImage.fileId) {
                    console.log('Deleting old profile image from GridFS:', driver.profileImage.fileId);
                    await deleteFile(driver.profileImage.fileId);
                }

                // Upload new file to GridFS
                const fileId = await uploadFile(req.file);
                console.log('New image uploaded to GridFS, fileId:', fileId);

                // Update driver's profileImage field
                driver.profileImage = {
                    fileId: fileId,
                    contentType: req.file.mimetype
                };

            } catch (error) {
                console.error('Error processing image with GridFS:', error);
                return res.status(500).json({
                    status: 'error',
                    message: 'Error processing image',
                    details: error.message
                });
            }
        }

        // Add other fields to update
        if (name) driver.name = name;
        if (phoneNumber) driver.phoneNumber = phoneNumber;
        if (vehicleDetails) {
            try {
                const parsedDetails = JSON.parse(vehicleDetails);
                driver.vehicleDetails = parsedDetails;
            } catch (e) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid vehicle details format'
                });
            }
        }

        console.log('Updating driver with data:', {
            id: req.driver.id,
            hasNewImage: !!req.file,
            updatedFields: {
                name: driver.name,
                phoneNumber: driver.phoneNumber,
                vehicleDetails: driver.vehicleDetails,
                profileImage: driver.profileImage
            }
        });

        // Save the updated driver
        console.log('Saving driver updates...');
        const updatedDriver = await driver.save();
        console.log('Driver updated successfully:', {
            id: updatedDriver._id,
            hasProfileImage: !!(updatedDriver.profileImage && updatedDriver.profileImage.fileId)
        });

        // Verify the update
        const verifiedDriver = await Driver.findById(req.driver.id);
        console.log('Verification - Driver in database:', {
            id: verifiedDriver._id,
            hasProfileImage: !!(verifiedDriver.profileImage && verifiedDriver.profileImage.fileId),
            profileImageDetails: verifiedDriver.profileImage
        });

        // Prepare response data
        const responseData = updatedDriver.toObject();
        delete responseData.password;

        res.json({
            status: 'success',
            data: responseData
        });
    } catch (error) {
        console.error('Error updating driver profile:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error',
            details: error.message
        });
    }
});

module.exports = router; 