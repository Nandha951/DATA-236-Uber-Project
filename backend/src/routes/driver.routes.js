const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const driverController = require('../controllers/driver.controller');
const validate = require('../middleware/validate.middleware');
const { Driver } = require('../models/associations'); // Assuming you have associations set up

// Debug middleware for driver routes
router.use((req, res, next) => {
    console.log('=== Driver Route Debug ===');
    console.log(`Method: ${req.method}`);
    console.log(`Base URL: ${req.baseUrl}`);
    console.log(`Path: ${req.path}`);
    console.log(`Full URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    console.log('=========================');
    next();
});

// Wrap async route handlers with error handling
const asyncHandler = fn => (req, res, next) => {
    console.log(`Executing route handler for ${req.method} ${req.originalUrl}`);
    return Promise.resolve(fn(req, res, next))
        .catch(error => {
            console.error('Route Error:', error);
            next(error);
        });
};

/**
 * @api {get} /api/drivers Get all drivers
 * @apiName GetAllDrivers
 * @apiGroup Driver
 * @apiSuccess {String} status Success status
 * @apiSuccess {Object[]} data List of drivers
 * @apiError {String} status Error status
 * @apiError {String} message Error message
 */
router.get('/', (req, res, next) => {
    console.log('GET /api/drivers route hit');
    asyncHandler(driverController.getAllDrivers)(req, res, next);
});

/**
 * @api {get} /api/drivers/:ssn Get driver by SSN
 * @apiName GetDriverBySsn
 * @apiGroup Driver
 * @apiParam {String} ssn Driver's SSN
 */
router.get('/:ssn', asyncHandler(driverController.getDriverBySsn));

/**
 * @api {post} /api/drivers Create a new driver
 * @apiName CreateDriver
 * @apiGroup Driver
 */
router.post('/', asyncHandler(driverController.createDriver));

/**
 * @api {put} /api/drivers/:ssn Update driver
 * @apiName UpdateDriver
 * @apiGroup Driver
 * @apiParam {String} ssn Driver's SSN
 */
router.put('/:ssn', asyncHandler(driverController.updateDriver));

/**
 * @api {delete} /api/drivers/:ssn Delete driver
 * @apiName DeleteDriver
 * @apiGroup Driver
 * @apiParam {String} ssn Driver's SSN
 */
router.delete('/:ssn', asyncHandler(driverController.deleteDriver));

module.exports = router;