const Billing = require('../models/Billing');

// Create Billing
exports.createBilling = async (req, res) => {
  try {
    const billing = new Billing(req.body);
    await billing.save();
    res.status(201).json(billing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all Billings
exports.getBillings = async (req, res) => {
  try {
    const billings = await Billing.find();
    res.json(billings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Billing by ID
exports.getBillingById = async (req, res) => {
  try {
    const billing = await Billing.findById(req.params.id);
    if (!billing) return res.status(404).json({ error: 'Billing not found' });
    res.json(billing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Billing
exports.updateBilling = async (req, res) => {
  try {
    const billing = await Billing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!billing) return res.status(404).json({ error: 'Billing not found' });
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
    res.json({ message: 'Billing deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 