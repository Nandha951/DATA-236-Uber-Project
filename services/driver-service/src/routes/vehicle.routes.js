const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Vehicle management routes
router.post('/register', authMiddleware, vehicleController.registerVehicle);
router.get('/list', authMiddleware, vehicleController.getDriverVehicles);
router.put('/:vehicleId', authMiddleware, vehicleController.updateVehicle);
router.get('/:vehicleId', authMiddleware, vehicleController.getVehicleDetails);

module.exports = router; 