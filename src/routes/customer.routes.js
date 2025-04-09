const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const customerController = require('../controllers/customer.controller');
const validate = require('../middleware/validate.middleware');
const { Customer } = require('../models/associations'); // Assuming you have associations set up

// GET all customers
router.get('/', customerController.getAllCustomers);

// GET a customer by SSN
router.get('/:ssn', customerController.getCustomerBySsn);

// POST a new customer
router.post('/', customerController.createCustomer);

// PUT (update) a customer by SSN
router.put('/:ssn', customerController.updateCustomer);

// DELETE a customer by SSN
router.delete('/:ssn', customerController.deleteCustomer);

module.exports = router;
