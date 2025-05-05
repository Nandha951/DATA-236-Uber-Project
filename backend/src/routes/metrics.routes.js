const express = require('express');
const router = express.Router();
const metricsTracker = require('../utils/metrics');

// Get metrics in CSV format
router.get('/', (req, res) => {
    try {
        const csv = metricsTracker.generateCSV();
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=api_metrics.csv');
        res.send(csv);
    } catch (error) {
        console.error('Error generating metrics:', error);
        res.status(500).json({ message: 'Error generating metrics' });
    }
});

module.exports = router; 