const express = require('express');
const router = express.Router();
const rideController = require('../controllers/ride.controller');

// Create Ride
router.post('/', rideController.createRide);
// Get all Rides
router.get('/', rideController.getRides);
// Get Ride by ID
router.get('/:id', rideController.getRideById);
// Update Ride
router.put('/:id', rideController.updateRide);
// Delete Ride
router.delete('/:id', rideController.deleteRide);
// Get Rides by Customer 
router.get('/customer/:customerId', rideController.getRidesByCustomer);
// Get Rides by Driver
router.get('/driver/:driverId', rideController.getRidesByDriver);
// Get Ride Statistics
router.get('/stats/location', rideController.getRideStatistics);

// Find Nearby Drivers
router.get('/nearby-drivers', rideController.findNearbyDrivers);

module.exports = router; 