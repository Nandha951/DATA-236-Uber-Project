const mockUser = {
    id: '123456789',
    email: 'test@example.com',
    userType: 'customer'
};

const mockDriver = {
    id: '987654321',
    email: 'driver@example.com',
    userType: 'driver'
};

const mockAuthMiddleware = (req, res, next) => {
    // Add mock user to request
    req.user = req.headers['x-user-type'] === 'driver' ? mockDriver : mockUser;
    next();
};

module.exports = {
    mockAuthMiddleware,
    mockUser,
    mockDriver
}; 