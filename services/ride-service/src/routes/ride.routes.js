const express = require('express');
const { body } = require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { isDriver } = require('../middleware/role.middleware');

const router = express.Router();

// Validation middleware
const locationValidation = [
    body('coordinates').isArray().withMessage('Coordinates must be an array'),
    body('coordinates.*').isFloat().withMessage('Coordinates must be numbers'),
    body('address').notEmpty().withMessage('Address is required')
];

const requestRideValidation = [
    body('pickup').isObject().withMessage('Pickup location is required'),
    body('pickup.coordinates').isArray().withMessage('Pickup coordinates must be an array'),
    body('pickup.coordinates.*').isFloat().withMessage('Pickup coordinates must be numbers'),
    body('pickup.address').notEmpty().withMessage('Pickup address is required'),
    body('dropoff').isObject().withMessage('Dropoff location is required'),
    body('dropoff.coordinates').isArray().withMessage('Dropoff coordinates must be an array'),
    body('dropoff.coordinates.*').isFloat().withMessage('Dropoff coordinates must be numbers'),
    body('dropoff.address').notEmpty().withMessage('Dropoff address is required'),
    body('paymentMethod').isIn(['cash', 'card', 'wallet']).withMessage('Invalid payment method')
];

const statusUpdateValidation = [
    body('status').isIn(['arrived', 'started', 'completed']).withMessage('Invalid status')
];

const cancelRideValidation = [
    body('reason').notEmpty().withMessage('Cancellation reason is required')
];

// Routes for users
router.post('/', authMiddleware, requestRideValidation, rideController.requestRide);
router.get('/history', authMiddleware, rideController.getUserRides);
router.get('/:rideId', authMiddleware, rideController.getRideById);
router.post('/:rideId/cancel', authMiddleware, cancelRideValidation, rideController.cancelRide);

// Routes for drivers
router.post('/:rideId/accept', [authMiddleware, isDriver], rideController.acceptRide);
router.put('/:rideId/status', [authMiddleware, isDriver], statusUpdateValidation, rideController.updateRideStatus);

module.exports = router; 