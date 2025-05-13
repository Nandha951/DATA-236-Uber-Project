const { Kafka } = require('kafkajs');

// Kafka configuration
const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID || 'ride-service',
    brokers: (process.env.KAFKA_BROKERS || 'kafka:9093').split(','),
    logCreator: () => {
        return ({ namespace, level, label, log }) => {
            const { message, ...extra } = log;
            const logMessage = `[KafkaJS] [${label}] ${namespace} - ${message} ${JSON.stringify(extra)}`;
            switch (level) {
                case require('kafkajs').logLevel.ERROR:
                case require('kafkajs').logLevel.NOTHING:
                    console.error(logMessage);
                    break;
                case require('kafkajs').logLevel.WARN:
                    console.warn(logMessage);
                    break;
                case require('kafkajs').logLevel.INFO:
                    console.info(logMessage);
                    break;
                case require('kafkajs').logLevel.DEBUG:
                default:
                    console.debug(logMessage);
                    break;
            }
        };
    },
    retry: {
        initialRetryTime: 300,
        retries: 10
    }
});

// Topic names
const TOPICS = {
    RIDE_REQUESTED: 'ride-requested',
    RIDE_ACCEPTED: 'ride-accepted',
    RIDE_STARTED: 'ride-started',
    RIDE_COMPLETED: 'ride-completed',
    RIDE_CANCELLED: 'ride-cancelled',
    DRIVER_LOCATION: 'driver-location',
    RIDE_PRICE_UPDATED: 'ride-price-updated'
};

module.exports = {
    kafka,
    TOPICS
}; 