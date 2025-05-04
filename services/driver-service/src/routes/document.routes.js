const express = require('express');
const router = express.Router();
const Driver = require('../models/driver.model');
const authMiddleware = require('../middleware/auth.middleware');

// Get all documents for the authenticated driver
router.get('/', authMiddleware, async (req, res) => {
    try {
        const driver = await Driver.findOne({ userId: req.driver.userId });
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        res.json(driver.documents);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add a new document
router.post('/', authMiddleware, async (req, res) => {
    try {
        const driver = await Driver.findOne({ userId: req.driver.userId });
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        driver.documents.push(req.body);
        await driver.save();
        res.status(201).json(driver.documents);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a document by index
router.put('/:index', authMiddleware, async (req, res) => {
    try {
        const driver = await Driver.findOne({ userId: req.driver.userId });
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        const index = parseInt(req.params.index);
        if (index < 0 || index >= driver.documents.length) {
            return res.status(404).json({ message: 'Document not found' });
        }
        driver.documents[index] = req.body;
        await driver.save();
        res.json(driver.documents[index]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 