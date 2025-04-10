const mongoose = require('mongoose');
require('dotenv').config();

const initializeMongoDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/uber_simulation';

        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log('MongoDB connection has been established successfully.');

        // Handle connection errors after initial connection
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected. Attempting to reconnect...');
            setTimeout(initializeMongoDB, 5000);
        });

        return mongoose.connection;
    } catch (error) {
        console.error('Unable to connect to MongoDB:', error);
        throw error;
    }
};

module.exports = initializeMongoDB;