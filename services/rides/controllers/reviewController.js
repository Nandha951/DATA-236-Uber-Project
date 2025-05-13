const Review = require('../models/review');
const Driver = require('../../drivers/models/driver');
const Customer = require('../../customers/models/customer');
const mongoose = require('mongoose');

const driverReviewSchema = new mongoose.Schema({
    rating: Number,
    comment: String,
    reviewerName: String,
    date: Date
  });

  // Create a schema for customer reviews (temporary, just for updates)
  const customerReviewSchema = new mongoose.Schema({
    rating: Number,
    comment: String,
    reviewerName: String,
    date: Date
  });

// Submit a review
exports.submitReview = async (req, res) => {
    try {
        // Check MongoDB connection
        if (mongoose.connection.readyState !== 1) {
            console.error('MongoDB not connected. Current state:', mongoose.connection.readyState);
            return res.status(500).json({
                message: 'Database connection error',
                details: 'Unable to connect to the database'
            });
        }

        const { rideId, reviewerId, reviewerType, revieweeId, revieweeType, rating, comment } = req.body;
        
        // Log request details
        console.log('Review submission received:', {
            rideId, reviewerId, reviewerType, revieweeId, revieweeType, rating, comment
        });
        
        // Check for missing required fields
        if (!rideId || !reviewerId || !reviewerType || !revieweeId || !revieweeType || !rating) {
            console.error('Missing required fields:', { rideId, reviewerId, reviewerType, revieweeId, revieweeType, rating });
            return res.status(400).json({ 
                message: 'Missing required fields',
                details: {
                    rideId: !rideId,
                    reviewerId: !reviewerId,
                    reviewerType: !reviewerType,
                    revieweeId: !revieweeId,
                    revieweeType: !revieweeType,
                    rating: !rating
                }
            });
        }
        
        // Validate reviewerType and revieweeType
        if (!['customer', 'driver'].includes(reviewerType) || 
            !['customer', 'driver'].includes(revieweeType)) {
            console.error('Invalid reviewer or reviewee type:', { reviewerType, revieweeType });
            return res.status(400).json({ 
                message: 'Invalid reviewer or reviewee type. Must be "customer" or "driver"',
                details: {
                    reviewerType,
                    revieweeType
                }
            });
        }
        
        // Validate rating
        const ratingNum = Number(rating);
        if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
            console.error('Invalid rating:', rating);
            return res.status(400).json({
                message: 'Invalid rating. Must be a number between 1 and 5',
                details: { rating }
            });
        }
        
        // Check for duplicate review
        const existing = await Review.findOne({ rideId, reviewerId });
        if (existing) {
            console.log('Duplicate review detected:', existing);
            return res.status(409).json({ 
                message: 'You have already submitted a review for this ride.',
                existingReview: existing
            });
        }
    
        // Create and save the review
        const review = new Review({ 
            rideId, 
            reviewerId, 
            reviewerType, 
            revieweeId, 
            revieweeType, 
            rating: ratingNum,
            comment: comment || undefined // Only set if provided
        });
        
        await review.save();
        console.log('Review saved successfully:', review);
        
        res.status(201).json({ 
            message: 'Review submitted successfully.',
            review
        });
    } catch (error) {
        console.error('Error submitting review:', error);
        
        // Handle specific MongoDB errors
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({
                message: 'Validation error',
                details: Object.keys(error.errors).reduce((acc, key) => {
                    acc[key] = error.errors[key].message;
                    return acc;
                }, {})
            });
        }
        
        if (error.code === 11000) { // Duplicate key error
            return res.status(409).json({
                message: 'Duplicate review detected',
                details: error.keyPattern
            });
        }

        if (error.name === 'MongoServerError') {
            return res.status(500).json({
                message: 'Database operation failed',
                details: error.message
            });
        }
        
        // Handle connection errors
        if (error.name === 'MongooseError' || error.name === 'MongoError') {
            return res.status(500).json({
                message: 'Database connection error',
                details: error.message
            });
        }
        
        res.status(500).json({ 
            message: 'Failed to submit review', 
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            details: process.env.NODE_ENV === 'development' ? {
                name: error.name,
                stack: error.stack
            } : undefined
        });
    }
};

// Get reviews for a user
exports.getReviewsForUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const reviews = await Review.find({ revieweeId: userId });
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ 
            message: 'Failed to fetch reviews', 
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Check if a user has already reviewed a ride
exports.checkReviewStatus = async (req, res) => {
    try {
        const { rideId, reviewerId } = req.params;
        const review = await Review.findOne({ rideId, reviewerId });
        res.json({ hasReviewed: !!review });
    } catch (error) {
        console.error('Error checking review status:', error);
        res.status(500).json({ 
            message: 'Failed to check review status', 
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};