require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const rideRoutes = require('./routes/rideRoutes');
const cors = require('cors');
const kafkaProducer = require('./kafka/producer');
const kafkaConsumer = require('./kafka/consumer');

const app = express();

// Configure CORS
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));

// Connect to MongoDB
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

// Connect to Redis
const { connectRedis } = require('./redisClient');
connectRedis().catch(err => {
  console.error('Failed to connect to Redis:', err);
  process.exit(1);
});

app.use(express.json());

// Initialize Kafka
async function initializeKafka() {
  try {
    console.log('Initializing Kafka...');

    // Connect producer
    await kafkaProducer.connect();

    // Register handlers for different topics using the imported consumer instance
    kafkaConsumer.registerHandler('ride-requested', async (data) => {
      console.log('Processing ride request', { data });
      // Add your ride request handling logic here
    });

    kafkaConsumer.registerHandler('driver-location', async (data) => {
      console.log('Processing driver location update', { data });
      // Add your location update handling logic here
    });

    kafkaConsumer.registerHandler('ride-completed', async (data) => {
      console.log('Processing ride completion', { data });
      // Add your ride completion handling logic here
    });

    // Connect consumer and start consuming using the imported consumer instance
    await kafkaConsumer.connect();
    await kafkaConsumer.startConsuming();

    console.log('Kafka initialization completed successfully');
  } catch (error) {
    console.error('Error initializing Kafka', {
      error: error.message,
      stack: error.stack
    });
    process.exit(1);
  }
}

// Initialize Kafka when the app starts
initializeKafka();

// Test message queue logging
async function testMessageQueueLogging() {
  try {
    console.log('\n=== Testing Message Queue Logging ===\n');

    // Test producer connection
    await kafkaProducer.connect();

    // Test consumer connection using the imported consumer instance
    await kafkaConsumer.connect();

    // Test ride request
    const rideRequest = {
      id: 'TEST_RIDE_001',
      customerId: 'TEST_CUSTOMER_001',
      pickupLocation: { lat: 37.7749, lng: -122.4194 },
      dropoffLocation: { lat: 37.7833, lng: -122.4167 },
      timestamp: new Date().toISOString()
    };

    console.log('\n1. Testing Ride Request...');
    await kafkaProducer.sendRideRequested(rideRequest);

    // Test ride acceptance
    const rideAcceptance = {
      id: 'TEST_RIDE_001',
      driverId: 'TEST_DRIVER_001',
      vehicleId: 'TEST_VEHICLE_001',
      timestamp: new Date().toISOString()
    };

    console.log('\n2. Testing Ride Acceptance...');
    await kafkaProducer.sendRideAccepted(rideAcceptance);

    // Test driver location update
    const driverLocation = {
      id: 'TEST_DRIVER_001',
      rideId: 'TEST_RIDE_001',
      location: { lat: 37.7750, lng: -122.4195 },
      timestamp: new Date().toISOString()
    };

    console.log('\n3. Testing Driver Location Update...');
    await kafkaProducer.sendDriverLocation(driverLocation);

    // Test error handling
    console.log('\n4. Testing Error Handling...');
    try {
      await kafkaProducer.sendMessage('non-existent-topic', { test: 'error' });
    } catch (error) {
      console.log('Expected error caught:', error.message);
    }

    // Register test consumer handler using the imported consumer instance
    kafkaConsumer.registerHandler('ride-requested', async (data) => {
      console.log('\nReceived ride request in consumer:', data);
    });

    // Start consumer using the imported consumer instance
    await kafkaConsumer.startConsuming();

    console.log('\n=== Message Queue Logging Test Complete ===\n');

  } catch (error) {
    console.error('Error during message queue logging test:', error);
  }
}

// Call the test function after Kafka initialization
testMessageQueueLogging();

// Example route to handle Kafka events from frontend
app.post('/api/kafka/events', async (req, res) => {
  try {
    const { event, data } = req.body;
    console.log('Received event from frontend', { event, data });

    // Handle different event types
    switch (event) {
      case 'RIDE_REQUESTED':
        await kafkaProducer.sendRideRequested(data);
        break;
      case 'DRIVER_LOCATION':
        await kafkaProducer.sendDriverLocation(data);
        break;
      case 'RIDE_COMPLETED':
        await kafkaProducer.sendRideCompleted(data);
        break;
      default:
        console.log('Unknown event type', { event });
        return res.status(400).json({ error: 'Unknown event type' });
    }

    res.status(200).json({ message: 'Event processed successfully' });
  } catch (error) {
    console.error('Error processing event', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: 'Failed to process event' });
  }
});

// Routes
app.use('/api/rides', rideRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`🚗 Rides Service running on port ${PORT}`);
});


