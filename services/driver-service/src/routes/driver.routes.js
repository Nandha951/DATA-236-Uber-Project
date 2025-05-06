const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driver.controller');

// Create Driver
router.post('/', driverController.createDriver);
// Get all Drivers
router.get('/', driverController.getDrivers);
// Get Driver by ID
router.get('/:id', driverController.getDriverById);
// Update Driver
router.put('/:id', driverController.updateDriver);
// Delete Driver
router.delete('/:id', driverController.deleteDriver);

module.exports = router; 