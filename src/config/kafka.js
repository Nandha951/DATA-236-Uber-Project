const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'uber-simulation-backend',
    brokers: ['localhost:9092'] // Replace with your Kafka brokers
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'uber-simulation-group' });

const initializeKafka = async () => {
    try {
        await producer.connect();

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log({
                    topic,
                    partition,
                    offset: message.offset,
                    value: message.value.toString(),
                });
            },
        });

        console.log('Kafka initialized successfully.');
    } catch (error) {
        console.error('Failed to initialize Kafka:', error);
        process.exit(1);
    }
};

module.exports = { kafka, producer, consumer, initializeKafka };