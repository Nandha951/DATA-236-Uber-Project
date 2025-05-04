const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { validationResult } = require('express-validator');

const authController = {
    // Login user
    async login(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;

            // Find user
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Check password
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Check if user is active
            if (!user.isActive) {
                return res.status(401).json({ message: 'User account is deactivated' });
            }

            // Generate tokens
            const accessToken = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '15m' }
            );

            const refreshToken = jwt.sign(
                { userId: user._id },
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: '7d' }
            );

            // Remove password from response
            const userResponse = user.toObject();
            delete userResponse.password;

            res.json({
                message: 'Login successful',
                user: userResponse,
                accessToken,
                refreshToken
            });
        } catch (error) {
            res.status(500).json({ message: 'Error during login', error: error.message });
        }
    },

    // Refresh access token
    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(401).json({ message: 'Refresh token is required' });
            }

            // Verify refresh token
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            
            // Find user
            const user = await User.findById(decoded.userId);
            if (!user || !user.isActive) {
                return res.status(401).json({ message: 'Invalid refresh token' });
            }

            // Generate new access token
            const accessToken = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '15m' }
            );

            res.json({
                accessToken
            });
        } catch (error) {
            res.status(401).json({ message: 'Invalid refresh token' });
        }
    },

    // Logout user
    async logout(req, res) {
        try {
            // In a real application, you might want to:
            // 1. Add the token to a blacklist
            // 2. Clear any session data
            // 3. Clear any cookies
            
            res.json({ message: 'Logout successful' });
        } catch (error) {
            res.status(500).json({ message: 'Error during logout', error: error.message });
        }
    }
};

module.exports = authController; 