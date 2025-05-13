const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.post('/signup', customerController.signup);
router.post('/login', customerController.login);

// These are now placeholders — will connect to other services
router.get('/nearby-drivers', customerController.findNearbyDrivers);
router.post('/rides/:rideId/bill', customerController.generateBill);
router.post('/rides/:rideId/images', customerController.uploadRideImages);

router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomerById);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;
