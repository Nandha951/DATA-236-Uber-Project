const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const rideController = require('../controllers/ride.controller');
const validate = require('../middleware/validate.middleware');
const { Ride } = require('../models/associations'); // Assuming you have associations set up

// GET all rides
router.get('/', authMiddleware, rideController.getAllRides);

// GET a ride by ID
router.get('/:rideId', authMiddleware, rideController.getRideById);

// POST a new ride
router.post('/', authMiddleware, validate(Ride), rideController.createRide);

// PUT (update) a ride by ID
router.put('/:rideId', authMiddleware, validate(Ride), rideController.updateRide);

// DELETE a ride by ID
router.delete('/:rideId', authMiddleware, rideController.deleteRide);

module.exports = router;