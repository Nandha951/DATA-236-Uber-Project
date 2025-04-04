const Redis = require('redis');
require('dotenv').config();

const redisClient = Redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD,
    retry_strategy: function (options) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
            return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
            return undefined;
        }
        return Math.min(options.attempt * 100, 3000);
    }
});

const initializeRedis = async () => {
    try {
        await redisClient.connect();
        console.log('Redis connection has been established successfully.');

        redisClient.on('error', (err) => {
            console.error('Redis connection error:', err);
        });

        redisClient.on('reconnecting', () => {
            console.log('Redis reconnecting...');
        });

        return redisClient;
    } catch (error) {
        console.error('Unable to connect to Redis:', error);
        throw error;
    }
};

module.exports = {
    initializeRedis,
    redisClient
}; 