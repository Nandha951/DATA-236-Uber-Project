const process = require('process');

// Helper function to parse boolean environment variables
const parseBoolEnv = (envVar, defaultValue = false) => {
    const value = process.env[envVar];
    if (value === undefined) {
        return defaultValue;
    }
    return value.toLowerCase() === 'true';
};

const appConfig = {
    // Set to true via environment variable ENABLE_REDIS=true
    // Defaults to true if the variable is not set
    redisEnabled: parseBoolEnv('ENABLE_REDIS', true),

    // Set to true via environment variable ENABLE_KAFKA=true
    // Defaults to true if the variable is not set
    kafkaEnabled: parseBoolEnv('ENABLE_KAFKA', true),

    // Add other configurations as needed
};

console.log(`App Config Loaded: Redis Enabled = ${appConfig.redisEnabled}, Kafka Enabled = ${appConfig.kafkaEnabled}`);

module.exports = appConfig; 