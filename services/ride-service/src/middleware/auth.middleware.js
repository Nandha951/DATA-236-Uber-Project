const jwt = require('jsonwebtoken');
const axios = require('axios');

const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from User Service
        try {
            const response = await axios.get(`${process.env.USER_SERVICE_URL}/api/users/${decoded.userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            req.user = response.data;
            next();
        } catch (error) {
            if (error.response?.status === 404) {
                return res.status(401).json({ message: 'User not found' });
            }
            throw error;
        }
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        res.status(500).json({ message: 'Authentication error', error: error.message });
    }
};

module.exports = authMiddleware; 