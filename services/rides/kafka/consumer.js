const { kafka, TOPICS } = require('./config');
const MessageLogger = require('./messageLogger');

class KafkaConsumer {
    constructor() {
        this.consumer = kafka.consumer({ groupId: 'ride-service-group' });
        this.handlers = new Map();
        MessageLogger.logConnectionStatus('Consumer', 'Initialized', {
            groupId: 'ride-service-group'
        });
    }

    async connect() {
        try {
            await this.consumer.connect();
            MessageLogger.logConnectionStatus('Consumer', 'Connected', {
                groupId: this.consumer.groupId
            });
        } catch (error) {
            MessageLogger.logMessageError('connection', error);
            throw error;
        }
    }

    async disconnect() {
        try {
            await this.consumer.disconnect();
            MessageLogger.logConnectionStatus('Consumer', 'Disconnected', {
                groupId: this.consumer.groupId
            });
        } catch (error) {
            MessageLogger.logMessageError('disconnection', error);
            throw error;
        }
    }

    registerHandler(topic, handler) {
        this.handlers.set(topic, handler);
        MessageLogger.logConnectionStatus('Handler', 'Registered', { topic });
    }

    async startConsuming() {
        try {
            const topics = Object.values(TOPICS);
            MessageLogger.logConnectionStatus('Consumer', 'Subscribing', { topics });

            await this.consumer.subscribe({ topics, fromBeginning: true });

            await this.consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    const startTime = Date.now();
                    try {
                        const value = JSON.parse(message.value.toString());
                        MessageLogger.logMessageReceived(topic, value);

                        const handler = this.handlers.get(topic);
                        if (handler) {
                            MessageLogger.logMessageProcessing(topic, value, 'Started');
                            await handler(value);
                            MessageLogger.logMessageProcessing(topic, value, 'Completed');
                        } else {
                            MessageLogger.logMessageError(topic, new Error('No handler found'), value);
                        }
                    } catch (error) {
                        MessageLogger.logMessageError(topic, error, message);
                    }
                }
            });
        } catch (error) {
            MessageLogger.logMessageError('consumption', error);
            throw error;
        }
    }
}

module.exports = new KafkaConsumer(); 