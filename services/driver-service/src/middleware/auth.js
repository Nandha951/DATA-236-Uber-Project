const jwt = require('jsonwebtoken');
const { redisClient } = require('../config/redis');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'No authentication token provided'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if token is blacklisted
        const isBlacklisted = await redisClient.get(`blacklist:${token}`);
        if (isBlacklisted) {
            return res.status(401).json({
                status: 'error',
                message: 'Token has been invalidated'
            });
        }

        // Add driver info to request
        req.driver = {
            id: decoded.id,
            role: decoded.role
        };

        next();
    } catch (error) {
        res.status(401).json({
            status: 'error',
            message: 'Invalid authentication token'
        });
    }
};

module.exports = auth; 