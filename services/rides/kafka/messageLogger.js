//const logger = require('../utils/logger'); // Removed require

class MessageLogger {
    static logMessageSent(topic, message, deliveryTime) {
        //logger.messageQueue.sent(topic, message, deliveryTime); // Removed logger usage
        console.log(`Message sent to ${topic}: ${message} at ${deliveryTime}`); // Replaced with console.log
    }

    static logMessageReceived(topic, message) {
        //logger.messageQueue.received(topic, message); // Removed logger usage
        console.log(`Message received from ${topic}: ${message}`); // Replaced with console.log
    }

    static logMessageError(topic, error, message) {
        //logger.messageQueue.error(topic, error, message); // Removed logger usage
        console.error(`Error in ${topic}: ${error} - Message: ${message}`); // Replaced with console.error
    }

    static logConnectionStatus(component, status, details = {}) {
        //logger.messageQueue.connection(component, status, details); // Removed logger usage
        console.log(`Connection status of ${component}: ${status}`); // Replaced with console.log
    }

    static logMessageProcessing(topic, message, status) {
        //logger.messageQueue.processing(topic, message, status); // Removed logger usage
        console.log(`Processing status of ${topic}: ${status}`); // Replaced with console.log
    }

    static logConsumedMessage(topic, partition, message) {
        //logger.info(`Consumed message from ${topic} [${partition}]: Offset ${message.offset}, Key ${message.key}`); // Removed logger usage
        console.log(`Consumed message from ${topic} [${partition}]: Offset ${message.offset}, Key ${message.key}`); // Replaced with console.log
    }

    static logProducedMessage(topic, partition, offset, message) {
        // logger.info(`Produced message to ${topic} [${partition}]: Offset ${offset}`); // Removed logger usage
        console.log(`Produced message to ${topic} [${partition}]: Offset ${offset}`); // Replaced with console.log
    }
}

module.exports = MessageLogger; 