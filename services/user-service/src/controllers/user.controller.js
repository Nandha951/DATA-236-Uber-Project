const User = require('../models/user.model');
const { validationResult } = require('express-validator');

const userController = {
    // Create a new user
    async createUser(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password, firstName, lastName, phoneNumber, userType } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const user = new User({
                email,
                password,
                firstName,
                lastName,
                phoneNumber,
                userType
            });

            await user.save();

            // Remove password from response
            const userResponse = user.toObject();
            delete userResponse.password;

            res.status(201).json({
                message: 'User created successfully',
                user: userResponse
            });
        } catch (error) {
            res.status(500).json({ message: 'Error creating user', error: error.message });
        }
    },

    // Get user by ID
    async getUserById(req, res) {
        try {
            const user = await User.findById(req.params.id).select('-password');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching user', error: error.message });
        }
    },

    // Update user
    async updateUser(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { firstName, lastName, phoneNumber, profilePicture } = req.body;
            const user = await User.findById(req.params.id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Update fields
            user.firstName = firstName || user.firstName;
            user.lastName = lastName || user.lastName;
            user.phoneNumber = phoneNumber || user.phoneNumber;
            user.profilePicture = profilePicture || user.profilePicture;
            user.updatedAt = new Date();

            await user.save();

            // Remove password from response
            const userResponse = user.toObject();
            delete userResponse.password;

            res.json({
                message: 'User updated successfully',
                user: userResponse
            });
        } catch (error) {
            res.status(500).json({ message: 'Error updating user', error: error.message });
        }
    },

    // Delete user
    async deleteUser(req, res) {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Soft delete by setting isActive to false
            user.isActive = false;
            user.updatedAt = new Date();
            await user.save();

            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting user', error: error.message });
        }
    },

    // Get all users (with pagination)
    async getAllUsers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const users = await User.find({ isActive: true })
                .select('-password')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const total = await User.countDocuments({ isActive: true });

            res.json({
                users,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalUsers: total
            });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users', error: error.message });
        }
    }
};

module.exports = userController; 