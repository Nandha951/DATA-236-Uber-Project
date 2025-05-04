const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driver.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { body } = require('express-validator');

// Validation middleware
const driverRegistrationValidation = [
    body('licenseNumber').notEmpty().withMessage('License number is required'),
    body('licenseExpiry').isDate().withMessage('Valid license expiry date is required'),
    body('vehicleDetails').isObject().withMessage('Vehicle details are required'),
    body('vehicleDetails.make').notEmpty().withMessage('Vehicle make is required'),
    body('vehicleDetails.model').notEmpty().withMessage('Vehicle model is required'),
    body('vehicleDetails.year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Valid vehicle year is required'),
    body('vehicleDetails.color').notEmpty().withMessage('Vehicle color is required'),
    body('vehicleDetails.licensePlate').notEmpty().withMessage('License plate is required'),
    body('vehicleDetails.registrationNumber').notEmpty().withMessage('Registration number is required'),
    body('vehicleDetails.type').isIn(['SEDAN', 'SUV', 'VAN', 'LUXURY']).withMessage('Valid vehicle type is required'),
    body('vehicleDetails.capacity').isInt({ min: 1 }).withMessage('Valid vehicle capacity is required')
];

// Routes
router.post('/register', authMiddleware, driverRegistrationValidation, driverController.registerDriver);
router.get('/profile', authMiddleware, driverController.getDriverProfile);
router.put('/profile', authMiddleware, driverController.updateDriverProfile);
router.put('/status', authMiddleware, driverController.updateDriverStatus);
router.put('/location', authMiddleware, driverController.updateDriverLocation);

module.exports = router; 