const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin authentication routes
router.post('/signup', adminController.signup);
router.post('/login', adminController.login);

// Add new driver
router.post('/drivers', adminController.addDriver);

// Add new customer
router.post('/customers', adminController.addCustomer);

// Review driver account
router.get('/drivers/:driverId', adminController.reviewDriver);

// Review customer account
router.get('/customers/:customerId', adminController.reviewCustomer);

// Get revenue statistics
router.get('/statistics/revenue', adminController.getRevenueStatistics);

// Get ride statistics for charts
router.get('/statistics/rides', adminController.getRideStatistics);

// Search bills
router.get('/bills/search', adminController.searchBills);

// Get bill details
router.get('/bills/:billId', adminController.getBillDetails);

module.exports = router; 