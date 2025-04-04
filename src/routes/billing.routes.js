const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const billingController = require('../controllers/billing.controller');
const validate = require('../middleware/validate.middleware');
const { Billing } = require('../models/associations'); // Assuming you have associations set up

// GET all billings
router.get('/', authMiddleware, billingController.getAllBillings);

// GET a billing by ID
router.get('/:billingId', billingController.getBillingById);

// POST a new billing
router.post('/', validate(Billing), billingController.createBilling);

// PUT (update) a billing by ID
router.put('/:billingId', validate(Billing), billingController.updateBilling);

// DELETE a billing by ID
router.delete('/:billingId', billingController.deleteBilling);

module.exports = router;