const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');

// Generate bill for a ride
router.post('/rides/:rideId', billingController.generateBill);

// Get all bills
router.get('/', billingController.getAllBills);

// Search bills
router.get('/search', billingController.searchBills);

// Get bill by ID
router.get('/:id', billingController.getBillById);

// Get bills by customer ID
router.get('/customer/:customerId', billingController.getBillsByCustomerId);

// Get bills by driver ID
router.get('/driver/:driverId', billingController.getBillsByDriverId);

// Update bill status
router.patch('/:id/status', billingController.updateBillStatus);

// Delete bill
router.delete('/:id', billingController.deleteBill);

module.exports = router; 