const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Payment processing routes
router.post('/process', authMiddleware, paymentController.processPayment);
router.post('/refund/:transactionId', authMiddleware, paymentController.processRefund);
router.get('/methods', authMiddleware, paymentController.getPaymentMethods);
router.post('/methods', authMiddleware, paymentController.addPaymentMethod);

module.exports = router; 