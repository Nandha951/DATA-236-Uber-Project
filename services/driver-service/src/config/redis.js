const Redis = require('redis');
const winston = require('winston');

const redisClient = Redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => winston.error('Redis Client Error:', err));
redisClient.on('connect', () => winston.info('Redis Client Connected'));

redisClient.connect().catch(console.error);

module.exports = { redisClient }; 