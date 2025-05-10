const redis = require('redis');
const redisClient = redis.createClient({ url: process.env.REDIS_URL || 'redis://redis:6379' });
redisClient.connect().then(() => console.log('Redis connected successfully')).catch(console.error);
module.exports = redisClient; 