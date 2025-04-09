const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const rideController = require('../controllers/ride.controller');
const validate = require('../middleware/validate.middleware');
const { Ride } = require('../models/associations'); // Assuming you have associations set up

// GET all rides
router.get('/', rideController.getAllRides);

// GET a ride by ID
router.get('/:rideId', rideController.getRideById);

// POST a new ride
router.post('/', rideController.createRide);

// PUT (update) a ride by ID
router.put('/:rideId', rideController.updateRide);

// DELETE a ride by ID
router.delete('/:rideId', rideController.deleteRide);

module.exports = router;