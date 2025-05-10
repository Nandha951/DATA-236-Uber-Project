const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billing.controller');

// Create Billing
router.post('/', billingController.createBilling);
// Get all Billings
router.get('/', billingController.getBillings);
// Get Billing by ID
router.get('/:id', billingController.getBillingById);
// Update Billing
router.put('/:id', billingController.updateBilling);
// Delete Billing
router.delete('/:id', billingController.deleteBilling);

module.exports = router; 