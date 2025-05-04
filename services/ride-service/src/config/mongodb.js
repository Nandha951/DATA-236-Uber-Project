const mongoose = require('mongoose');
const appConfig = require('./appConfig');

let isConnected = false;

const initializeMongoDB = async () => {
    try {
        if (isConnected) {
            console.log('Using existing MongoDB connection');
            return;
        }

        // Use test database URI if in test environment
        const dbUri = process.env.NODE_ENV === 'test' 
            ? (process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/uber-rides-test')
            : appConfig.mongodbUri;

        await mongoose.connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        isConnected = true;

        // Only create indexes if not in test environment
        if (process.env.NODE_ENV !== 'test') {
            try {
                const collections = await mongoose.connection.db.collections();
                const rideCollection = collections.find(c => c.collectionName === 'rides');
                
                if (rideCollection) {
                    await rideCollection.createIndex({ 'pickup.coordinates': '2dsphere' });
                    await rideCollection.createIndex({ 'dropoff.coordinates': '2dsphere' });
                    await rideCollection.createIndex({ status: 1, requestTime: -1 });
                }
            } catch (error) {
                console.warn('Warning: Could not create indexes:', error.message);
            }
        }

        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

mongoose.connection.on('disconnected', () => {
    isConnected = false;
    console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
    isConnected = false;
    console.error('MongoDB error:', err);
});

process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
    } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
    }
});

module.exports = initializeMongoDB; 