const jwt = require('jsonwebtoken');

// Replace with your actual user details and secret
const user = {
  id: 'user_id_here', // Replace with actual user ID
  role: 'admin' // or 'driver', 'customer'
};

const token = jwt.sign(user, 'your_jwt_secret_here', { expiresIn: '1h' });

console.log('Generated Token:', token); 