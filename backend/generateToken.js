const jwt = require('jsonwebtoken');

// Admin user details
const user = {
  id: 'admin_1',
  role: 'admin',
  email: 'admin@example.com'
};

// Use a consistent secret
const secret = 'your_jwt_secret_here';

// Generate token with 1 hour expiration
const token = jwt.sign(user, secret, { expiresIn: '1h' });

console.log('Generated Token:', token); 