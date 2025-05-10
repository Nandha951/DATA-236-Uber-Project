const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

/**
 * Dynamic Pricing Algorithm
 */
class PricingAlgorithm {
    constructor() {
        // Load and pre-process the Kaggle dataset (placeholder)
        this.dataset = this.loadDataset();
    }

    loadDataset() {
        // Load the Kaggle dataset and pre-process it (placeholder)
        console.log('Loading and pre-processing the Kaggle dataset...');
        return []; // Placeholder
    }

    predictFare(distance, timeOfDay, demand) {
        // Predict the fare based on distance, time of day, and demand (placeholder)
        console.log('Predicting fare based on distance, time of day, and demand...');
        let baseFare = 5;
        let distanceMultiplier = 1.5;
        let timeOfDayMultiplier = 1;
        let demandMultiplier = 1;

        // Adjust the fare based on distance
        let fare = baseFare + distance * distanceMultiplier;

        // Adjust the fare based on time of day (e.g., peak hours)
        if (timeOfDay >= 17 && timeOfDay <= 20) {
            timeOfDayMultiplier = 1.2; // Evening peak hours
        }

        // Adjust the fare based on demand (surge pricing)
        if (demand > 0.8) {
            demandMultiplier = 1 + (demand - 0.8) * 2; // Surge pricing
        }

        fare = fare * timeOfDayMultiplier * demandMultiplier;

        return fare;
    }

    getPredictedFare(startLocation, endLocation, startTime) {
        // Calculate the distance between start and end locations (placeholder)
        let distance = this.calculateDistance(startLocation, endLocation);

        // Get the time of day from the start time
        let startTimeDate = new Date(startTime);
        let timeOfDay = startTimeDate.getHours();

        // Get the demand (placeholder)
        let demand = this.getDemand();

        // Predict the fare
        let fare = this.predictFare(distance, timeOfDay, demand);

        return fare;
    }

    calculateDistance(startLocation, endLocation) {
        // Calculate the distance between two locations (placeholder)
        console.log('Calculating distance between two locations...');
        return 10; // Placeholder (kilometers)
    }

    getDemand() {
        // Get the demand (placeholder)
        console.log('Getting demand...');
        return 0.7; // Placeholder (0 to 1)
    }
}

const pricingAlgorithm = new PricingAlgorithm();

app.post('/predict-fare', (req, res) => {
    const { pickupTime, distanceCovered, rating } = req.body;
    // Use distanceCovered and rating directly in the fare calculation
    const fare = pricingAlgorithm.predictFare(
        distanceCovered,
        new Date(pickupTime).getHours(),
        rating / 5 // Normalize rating to 0-1 for demand
    );
    res.json({ predicted_fare: fare });
});

app.listen(PORT, () => {
    console.log(`ML Service is running on port ${PORT}`);
}); 