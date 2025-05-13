const express = require('express');
const router = express.Router();
const rideController = require('../controllers/rideController');
const reviewController = require('../controllers/reviewController');
// Add these to your existing routes
router.post('/reviews', reviewController.submitReview);
router.get('/reviews/user/:userId', reviewController.getReviewsForUser);
router.get('/reviews/check/:rideId/:reviewerId', reviewController.checkReviewStatus);
router.post('/', rideController.createRide);

// Get all rides
router.get('/', rideController.getAllRides);

// Get ride statistics
router.get('/statistics', rideController.getRideStatistics);

// Find nearby drivers
router.get('/nearby-drivers', rideController.findNearbyDrivers);

// Get rides by customer ID
router.get('/customer/:customerId', rideController.getRidesByCustomerId);

// Get rides by driver ID
router.get('/driver/:driverId', rideController.getRidesByDriverId);

// Upload ride images (must be before the :id route)
router.post('/:id/images', rideController.uploadRideImages);

// Get ride by ID
router.get('/:id', rideController.getRideById);

// Update ride
router.patch('/:id', rideController.updateRide);

// Update ride status
router.patch('/:id/status', rideController.updateRideStatus);

// Delete ride
router.delete('/:id', rideController.deleteRide);

module.exports = router; 