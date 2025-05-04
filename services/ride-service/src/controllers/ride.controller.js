const { validationResult } = require('express-validator');
const Ride = require('../models/ride.model');
const geolib = require('geolib');
const axios = require('axios');
const { cacheDriverLocation, getDriverLocation, cacheRideDetails, getRideDetails } = require('../config/redis');

const rideController = {
    // Request a new ride
    async requestRide(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { pickup, dropoff, paymentMethod } = req.body;
            const userId = req.user.id;

            // Calculate estimated distance and duration
            const distance = geolib.getDistance(
                { latitude: pickup.coordinates[1], longitude: pickup.coordinates[0] },
                { latitude: dropoff.coordinates[1], longitude: dropoff.coordinates[0] }
            ) / 1000; // Convert to kilometers

            // Rough estimation: 2 minutes per kilometer
            const duration = Math.ceil(distance * 2);

            const ride = new Ride({
                userId,
                pickup,
                dropoff,
                paymentMethod,
                estimatedDistance: distance,
                estimatedDuration: duration
            });

            // Calculate estimated price
            ride.estimatedPrice = ride.calculatePrice();

            await ride.save();

            // Notify nearby drivers (implement this with WebSocket/Redis)
            // this.notifyNearbyDrivers(ride);

            res.status(201).json({
                message: 'Ride requested successfully',
                ride
            });
        } catch (error) {
            res.status(500).json({ message: 'Error requesting ride', error: error.message });
        }
    },

    // Accept a ride (for drivers)
    async acceptRide(req, res) {
        try {
            const { rideId } = req.params;
            const driverId = req.user.id;

            const ride = await Ride.findById(rideId);
            if (!ride) {
                return res.status(404).json({ message: 'Ride not found' });
            }

            if (ride.status !== 'pending') {
                return res.status(400).json({ message: 'Ride is no longer available' });
            }

            // Check if driver has any active rides
            const activeRides = await Ride.findActiveRidesForDriver(driverId);
            if (activeRides.length > 0) {
                return res.status(400).json({ message: 'You have an active ride' });
            }

            ride.driverId = driverId;
            ride.status = 'accepted';
            ride.acceptTime = new Date();
            await ride.save();

            // Notify user that ride was accepted
            // this.notifyUser(ride.userId, 'ride_accepted', ride);

            res.json({
                message: 'Ride accepted successfully',
                ride
            });
        } catch (error) {
            res.status(500).json({ message: 'Error accepting ride', error: error.message });
        }
    },

    // Update ride status
    async updateRideStatus(req, res) {
        try {
            const { rideId } = req.params;
            const { status } = req.body;
            const userId = req.user.id;

            const ride = await Ride.findById(rideId);
            if (!ride) {
                return res.status(404).json({ message: 'Ride not found' });
            }

            // Verify that the user is either the driver or passenger
            if (ride.driverId.toString() !== userId && ride.userId.toString() !== userId) {
                return res.status(403).json({ message: 'Not authorized' });
            }

            // Validate status transition
            if (!this.isValidStatusTransition(ride.status, status)) {
                return res.status(400).json({ message: 'Invalid status transition' });
            }

            // Update status and corresponding timestamps
            ride.status = status;
            if (status === 'started') ride.startTime = new Date();
            if (status === 'completed') ride.endTime = new Date();

            await ride.save();

            // Notify relevant parties about status change
            // this.notifyRideStatusChange(ride);

            res.json({
                message: 'Ride status updated successfully',
                ride
            });
        } catch (error) {
            res.status(500).json({ message: 'Error updating ride status', error: error.message });
        }
    },

    // Cancel ride
    async cancelRide(req, res) {
        try {
            const { rideId } = req.params;
            const { reason } = req.body;
            const userId = req.user.id;

            const ride = await Ride.findById(rideId);
            if (!ride) {
                return res.status(404).json({ message: 'Ride not found' });
            }

            // Check if ride can be cancelled
            if (!ride.canBeCancelled()) {
                return res.status(400).json({ message: 'Ride cannot be cancelled' });
            }

            // Determine who cancelled the ride
            const cancelledBy = ride.driverId?.toString() === userId ? 'driver' : 'user';

            ride.status = 'cancelled';
            ride.cancellationReason = reason;
            ride.cancelledBy = cancelledBy;
            await ride.save();

            // Notify relevant parties about cancellation
            // this.notifyRideCancellation(ride);

            res.json({
                message: 'Ride cancelled successfully',
                ride
            });
        } catch (error) {
            res.status(500).json({ message: 'Error cancelling ride', error: error.message });
        }
    },

    // Get ride by ID
    async getRideById(req, res) {
        try {
            const { rideId } = req.params;
            const userId = req.user.id;

            const ride = await Ride.findById(rideId);
            if (!ride) {
                return res.status(404).json({ message: 'Ride not found' });
            }

            // Check if user is authorized to view this ride
            if (ride.userId.toString() !== userId && ride.driverId?.toString() !== userId) {
                return res.status(403).json({ message: 'Not authorized' });
            }

            res.json(ride);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching ride', error: error.message });
        }
    },

    // Get user's ride history
    async getUserRides(req, res) {
        try {
            const userId = req.user.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const rides = await Ride.find({ userId })
                .sort({ requestTime: -1 })
                .skip(skip)
                .limit(limit);

            const total = await Ride.countDocuments({ userId });

            res.json({
                rides,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalRides: total
            });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching rides', error: error.message });
        }
    },

    // Helper method to validate status transitions
    isValidStatusTransition(currentStatus, newStatus) {
        const validTransitions = {
            'pending': ['accepted', 'cancelled'],
            'accepted': ['arrived', 'cancelled'],
            'arrived': ['started', 'cancelled'],
            'started': ['completed', 'cancelled'],
            'completed': [],
            'cancelled': []
        };

        return validTransitions[currentStatus]?.includes(newStatus);
    }
};

module.exports = rideController; 