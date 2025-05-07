const { Kafka } = require('kafkajs');
const winston = require('winston');

const kafka = new Kafka({
    clientId: 'driver-service',
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(',')
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'driver-service-group' });

// Connect producer
producer.connect()
    .then(() => winston.info('Kafka Producer Connected'))
    .catch(err => winston.error('Kafka Producer Connection Error:', err));

// Connect consumer
consumer.connect()
    .then(() => winston.info('Kafka Consumer Connected'))
    .catch(err => winston.error('Kafka Consumer Connection Error:', err));

// Subscribe to topics
const subscribeToTopics = async () => {
    try {
        await consumer.subscribe({ topics: ['ride-requests', 'ride-updates'] });
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const value = JSON.parse(message.value.toString());

                    switch (topic) {
                        case 'ride-requests':
                            // Handle ride request
                            winston.info('Received ride request:', value);
                            break;
                        case 'ride-updates':
                            // Handle ride update
                            winston.info('Received ride update:', value);
                            break;
                    }
                } catch (error) {
                    winston.error('Error processing message:', error);
                }
            }
        });
    } catch (error) {
        winston.error('Error subscribing to topics:', error);
    }
};

subscribeToTopics();

module.exports = { producer, consumer }; 