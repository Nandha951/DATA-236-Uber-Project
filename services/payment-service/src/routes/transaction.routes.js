const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const paymentController = require('../controllers/payment.controller');

// List all transactions for the authenticated user (could be expanded later)
// router.get('/', authMiddleware, paymentController.listTransactions); // Not implemented in controller, so skip for now

// Process a payment
router.post('/pay', authMiddleware, paymentController.processPayment);

// Process a refund
router.post('/refund/:transactionId', authMiddleware, paymentController.processRefund);

// Get payment methods
router.get('/methods', authMiddleware, paymentController.getPaymentMethods);

// Add a payment method
router.post('/methods', authMiddleware, paymentController.addPaymentMethod);

module.exports = router; 