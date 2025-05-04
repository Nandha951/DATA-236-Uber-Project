const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../app');
const Ride = require('../models/ride.model');
const { redisClient } = require('../config/redis');
const { mockUser, mockDriver } = require('./mocks/auth.mock');
const initializeMongoDB = require('../config/mongodb');

// Set test environment
process.env.NODE_ENV = 'test';

// Mock the auth middleware
jest.mock('../middleware/auth.middleware', () => {
    return (req, res, next) => {
        req.user = req.headers['x-user-type'] === 'driver' ? mockDriver : mockUser;
        next();
    };
});

describe('Ride Service Tests', () => {
    let testRide;

    beforeAll(async () => {
        jest.setTimeout(30000); // Increase timeout for setup
        
        try {
            // Initialize MongoDB
            await initializeMongoDB();
            
            // Clear collections
            await Ride.deleteMany({});
            
            // Clear Redis cache if Redis is connected
            if (redisClient?.isReady) {
                await redisClient.flushAll();
            }
        } catch (error) {
            console.error('Test setup failed:', error);
            throw error;
        }
    });

    afterAll(async () => {
        try {
            // Clean up test database
            await Ride.deleteMany({});
            
            // Close Redis connection if connected
            if (redisClient?.isReady) {
                await redisClient.quit();
            }

            // Close MongoDB connection
            await mongoose.connection.close();
        } catch (error) {
            console.error('Test cleanup failed:', error);
            throw error;
        }
    });

    beforeEach(async () => {
        try {
            // Clear collections
            await Ride.deleteMany({});

            // Create a test ride
            testRide = await Ride.create({
                userId: mockUser.id,
                pickup: {
                    type: 'Point',
                    coordinates: [-73.935242, 40.730610],
                    address: 'Test Pickup Location'
                },
                dropoff: {
                    type: 'Point',
                    coordinates: [-73.935242, 40.730610],
                    address: 'Test Dropoff Location'
                },
                status: 'pending',
                paymentMethod: 'card',
                estimatedDistance: 5,
                estimatedDuration: 15,
                estimatedPrice: 20
            });
        } catch (error) {
            console.error('Test setup failed:', error);
            throw error;
        }
    });

    describe('Ride Creation', () => {
        it('should create a new ride request', async () => {
            const response = await request(app)
                .post('/api/rides')
                .set('x-user-type', 'customer')
                .send({
                    pickup: {
                        coordinates: [-73.935242, 40.730610],
                        address: 'New Pickup Location'
                    },
                    dropoff: {
                        coordinates: [-73.935242, 40.730610],
                        address: 'New Dropoff Location'
                    },
                    paymentMethod: 'card'
                });

            expect(response.status).toBe(201);
            expect(response.body.status).toBe('success');
            expect(response.body.data).toHaveProperty('_id');
        });

        it('should validate ride request data', async () => {
            const response = await request(app)
                .post('/api/rides')
                .set('x-user-type', 'customer')
                .send({
                    pickup: {
                        coordinates: [-73.935242],
                        address: 'Invalid Pickup'
                    }
                });

            expect(response.status).toBe(400);
            expect(response.body.status).toBe('error');
        });
    });

    describe('Ride Status Updates', () => {
        it('should update ride status as driver', async () => {
            const response = await request(app)
                .put(`/api/rides/${testRide._id}/status`)
                .set('x-user-type', 'driver')
                .send({
                    status: 'accepted'
                });

            expect(response.status).toBe(200);
            expect(response.body.data.status).toBe('accepted');
        });

        it('should prevent invalid status transitions', async () => {
            const response = await request(app)
                .put(`/api/rides/${testRide._id}/status`)
                .set('x-user-type', 'driver')
                .send({
                    status: 'completed'
                });

            expect(response.status).toBe(400);
        });
    });

    describe('Ride Cancellation', () => {
        it('should cancel a ride as customer', async () => {
            const response = await request(app)
                .post(`/api/rides/${testRide._id}/cancel`)
                .set('x-user-type', 'customer')
                .send({
                    reason: 'Test cancellation'
                });

            expect(response.status).toBe(200);
            expect(response.body.data.status).toBe('cancelled');
        });

        it('should prevent cancellation of completed rides', async () => {
            await Ride.findByIdAndUpdate(testRide._id, { status: 'completed' });
            
            const response = await request(app)
                .post(`/api/rides/${testRide._id}/cancel`)
                .set('x-user-type', 'customer')
                .send({
                    reason: 'Test cancellation'
                });

            expect(response.status).toBe(400);
        });
    });

    describe('Ride History', () => {
        it('should fetch user ride history', async () => {
            const response = await request(app)
                .get('/api/rides/history')
                .set('x-user-type', 'customer');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body.data)).toBe(true);
        });

        it('should support pagination', async () => {
            const response = await request(app)
                .get('/api/rides/history?page=1&limit=10')
                .set('x-user-type', 'customer');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('pagination');
        });
    });
}); 