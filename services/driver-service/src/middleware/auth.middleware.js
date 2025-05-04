const jwt = require('jsonwebtoken');
const Driver = require('../models/driver.model');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const driver = await Driver.findOne({ userId: decoded.userId });
        if (!driver) {
            return res.status(401).json({ message: 'Driver not found' });
        }
        if (driver.status !== 'ACTIVE') {
            return res.status(401).json({ message: 'Driver account is not active' });
        }
        req.driver = driver;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware; 