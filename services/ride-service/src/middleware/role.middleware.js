const isDriver = (req, res, next) => {
    if (!req.user || req.user.userType !== 'driver') {
        return res.status(403).json({ message: 'Access denied. Driver role required.' });
    }
    next();
};

const isCustomer = (req, res, next) => {
    if (!req.user || req.user.userType !== 'customer') {
        return res.status(403).json({ message: 'Access denied. Customer role required.' });
    }
    next();
};

module.exports = {
    isDriver,
    isCustomer
}; 