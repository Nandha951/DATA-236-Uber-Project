require('dotenv').config();

const appConfig = {
    port: process.env.PORT || 3001,
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/uber-users',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    nodeEnv: process.env.NODE_ENV || 'development'
};

module.exports = appConfig; 