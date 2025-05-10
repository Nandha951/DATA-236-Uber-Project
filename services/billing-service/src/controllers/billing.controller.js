const Billing = require('../models/Billing');
const redisClient = require('../redis');
const axios = require('axios');

// Create Billing
exports.createBilling = async (req, res) => {
  try {
    // Call the ML service to get the predicted fare
    const { pickupTime, rating, distanceCovered } = req.body;
    const mlPayload = { pickupTime, distanceCovered, rating };
    console.log('Sending to ML service:', mlPayload);
    const mlResponse = await axios.post('http://ml-service:5000/predict-fare', mlPayload);
    const totalAmount = mlResponse.data.predicted_fare;
    const billing = new Billing({ ...req.body, totalAmount });
    await billing.save();
    // Invalidate cache
    await redisClient.del('billings:all');
    res.status(201).json(billing);
  } catch (err) {
    console.error('Billing creation error:', err);
    res.status(400).json({ error: err.message });
  }
};

// Get all Billings (with Redis cache)
exports.getBillings = async (req, res) => {
  try {
    const cache = await redisClient.get('billings:all');
    if (cache) {
      return res.json(JSON.parse(cache));
    }
    const billings = await Billing.find();
    await redisClient.setEx('billings:all', 60, JSON.stringify(billings));
    res.json(billings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Billing by ID
exports.getBillingById = async (req, res) => {
  try {
    console.log('Fetching billing with id:', req.params.id);
    const billing = await Billing.findById(req.params.id);
    console.log('Billing found:', billing);
    if (!billing) return res.status(404).json({ error: 'Billing not found' });
    res.json(billing);
  } catch (err) {
    console.error('Error fetching billing:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update Billing
exports.updateBilling = async (req, res) => {
  try {
    const billing = await Billing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!billing) return res.status(404).json({ error: 'Billing not found' });
    // Invalidate cache
    await redisClient.del('billings:all');
    res.json(billing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Billing
exports.deleteBilling = async (req, res) => {
  try {
    const billing = await Billing.findByIdAndDelete(req.params.id);
    if (!billing) return res.status(404).json({ error: 'Billing not found' });
    // Invalidate cache
    await redisClient.del('billings:all');
    res.json({ message: 'Billing deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 