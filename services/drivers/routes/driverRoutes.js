const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');

router.post('/signup', driverController.signup);
router.post('/login', driverController.login);
router.get('/', driverController.getAllDrivers);
router.get('/search', driverController.searchDrivers);
router.get('/:id', driverController.getDriverById);
router.put('/:id', driverController.updateDriver);
router.delete('/:id', driverController.deleteDriver);
router.post('/:id/video', driverController.addDriverVideo);
router.get('/:id/video', driverController.getDriverVideo);
router.get('/:driverId/summary', driverController.getDriverSummary);


module.exports = router;
