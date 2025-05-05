const jwt = require('jsonwebtoken');
const { Driver, Customer, Admin } = require('../models/associations');

const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 'error',
                message: 'No token provided'
            });
        }

        const token = authHeader.split(' ')[1];

        // Verify token with consistent secret
        const decoded = jwt.verify(token, 'your_jwt_secret_here');

        // Get user based on role
        let user;
        switch (decoded.role) {
            case 'driver':
                user = await Driver.findByPk(decoded.id);
                break;
            case 'customer':
                user = await Customer.findByPk(decoded.id);
                break;
            case 'admin':
                user = await Admin.findByPk(decoded.id);
                break;
            default:
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid user role'
                });
        }

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Attach user to request
        req.user = user;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid token'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 'error',
                message: 'Token expired'
            });
        }
        next(error);
    }
};

// Role-based authorization middleware
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.userRole)) {
            return res.status(403).json({
                status: 'error',
                message: 'Access denied'
            });
        }
        next();
    };
};

module.exports = {
    authMiddleware,
    authorize
}; 