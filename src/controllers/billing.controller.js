const { Billing } = require('../models/associations'); // Assuming you have associations set up

// GET all billings
exports.getAllBillings = async (req, res) => {
    try {
        const billings = await Billing.findAll();
        res.status(200).json(billings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET a billing by ID
exports.getBillingById = async (req, res) => {
    try {
        const billing = await Billing.findByPk(req.params.billingId);
        if (!billing) {
            return res.status(404).json({ message: 'Billing not found' });
        }
        res.status(200).json(billing);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// POST a new billing
exports.createBilling = async (req, res) => {
    try {
        const billing = await Billing.create(req.body);
        res.status(201).json(billing);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// PUT (update) a billing by ID
exports.updateBilling = async (req, res) => {
    try {
        const billing = await Billing.findByPk(req.params.billingId);
        if (!billing) {
            return res.status(404).json({ message: 'Billing not found' });
        }
        await billing.update(req.body);
        res.status(200).json(billing);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// DELETE a billing by ID
exports.deleteBilling = async (req, res) => {
    try {
        const billing = await Billing.findByPk(req.params.billingId);
        if (!billing) {
            return res.status(404).json({ message: 'Billing not found' });
        }
        await billing.destroy();
        res.status(204).send(); // No content
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};