const { kafka, TOPICS } = require('./config');
const MessageLogger = require('./messageLogger');

class KafkaProducer {
    constructor() {
        this.producer = kafka.producer();
        MessageLogger.logConnectionStatus('Producer', 'Initialized', {
            clientId: kafka.clientId,
            brokers: kafka.brokers
        });
    }

    async connect() {
        try {
            await this.producer.connect();
            MessageLogger.logConnectionStatus('Producer', 'Connected', {
                clientId: kafka.clientId,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            MessageLogger.logMessageError('connection', error);
            throw error;
        }
    }

    async disconnect() {
        try {
            await this.producer.disconnect();
            MessageLogger.logConnectionStatus('Producer', 'Disconnected', {
                clientId: kafka.clientId,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            MessageLogger.logMessageError('disconnection', error);
            throw error;
        }
    }

    async sendMessage(topic, message) {
        const messageId = message.id || `msg_${Date.now()}`;
        const timestamp = Date.now();

        try {
            MessageLogger.logMessageProcessing(topic, message, 'Preparing');

            await this.producer.send({
                topic,
                messages: [
                    {
                        key: messageId,
                        value: JSON.stringify(message),
                        timestamp,
                        headers: {
                            messageType: message.type || 'unknown',
                            source: 'ride-service'
                        }
                    }
                ]
            });

            const deliveryTime = Date.now() - timestamp;
            MessageLogger.logMessageSent(topic, message, deliveryTime);
        } catch (error) {
            MessageLogger.logMessageError(topic, error, message);
            throw error;
        }
    }

    // Specific ride event methods with detailed logging
    async sendRideRequested(rideData) {
        const message = {
            ...rideData,
            type: 'RIDE_REQUESTED',
            timestamp: new Date().toISOString()
        };

        MessageLogger.logMessageProcessing('RIDE_REQUESTED', message, 'Preparing');
        await this.sendMessage(TOPICS.RIDE_REQUESTED, message);
    }

    async sendRideAccepted(rideData) {
        const message = {
            ...rideData,
            type: 'RIDE_ACCEPTED',
            timestamp: new Date().toISOString()
        };

        MessageLogger.logMessageProcessing('RIDE_ACCEPTED', message, 'Preparing');
        await this.sendMessage(TOPICS.RIDE_ACCEPTED, message);
    }

    async sendRideStarted(rideData) {
        const message = {
            ...rideData,
            type: 'RIDE_STARTED',
            timestamp: new Date().toISOString()
        };

        MessageLogger.logMessageProcessing('RIDE_STARTED', message, 'Preparing');
        await this.sendMessage(TOPICS.RIDE_STARTED, message);
    }

    async sendRideCompleted(rideData) {
        const message = {
            ...rideData,
            type: 'RIDE_COMPLETED',
            timestamp: new Date().toISOString()
        };

        MessageLogger.logMessageProcessing('RIDE_COMPLETED', message, 'Preparing');
        await this.sendMessage(TOPICS.RIDE_COMPLETED, message);
    }

    async sendRideCancelled(rideData) {
        const message = {
            ...rideData,
            type: 'RIDE_CANCELLED',
            timestamp: new Date().toISOString()
        };

        MessageLogger.logMessageProcessing('RIDE_CANCELLED', message, 'Preparing');
        await this.sendMessage(TOPICS.RIDE_CANCELLED, message);
    }

    async sendDriverLocation(locationData) {
        const message = {
            ...locationData,
            type: 'DRIVER_LOCATION',
            timestamp: new Date().toISOString()
        };

        MessageLogger.logMessageProcessing('DRIVER_LOCATION', message, 'Preparing');
        await this.sendMessage(TOPICS.DRIVER_LOCATION, message);
    }

    async sendRidePriceUpdated(priceData) {
        const message = {
            ...priceData,
            type: 'RIDE_PRICE_UPDATED',
            timestamp: new Date().toISOString()
        };

        MessageLogger.logMessageProcessing('RIDE_PRICE_UPDATED', message, 'Preparing');
        await this.sendMessage(TOPICS.RIDE_PRICE_UPDATED, message);
    }
}

module.exports = new KafkaProducer(); 