const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const driverController = require('../controllers/driver.controller');
const validate = require('../middleware/validate.middleware');
const { Driver } = require('../models/associations'); // Assuming you have associations set up

/**
 * @api {get} /drivers Get all drivers
 * @apiName GetAllDrivers
 * @apiGroup Driver
 * @apiSuccess {Object[]} drivers List of drivers.
 * @apiError ServerError Internal server error.
 */

// GET all drivers
router.get('/', authMiddleware, driverController.getAllDrivers);

/**
 * @api {get} /drivers/:ssn Get driver by SSN
 * @apiName GetDriverBySsn
 * @apiGroup Driver
 * @apiParam {String} ssn Driver's SSN.
 * @apiSuccess {Object} driver Driver object.
 * @apiError NotFound Driver not found.
 * @apiError ServerError Internal server error.
 */

// GET a driver by SSN
router.get('/:ssn', authMiddleware, driverController.getDriverBySsn);

/**
 * @api {post} /drivers Create a new driver
 * @apiName CreateDriver
 * @apiGroup Driver
 * @apiBody {String} ssn Driver's SSN.
 * @apiBody {String} firstName Driver's first name.
 * @apiBody {String} lastName Driver's last name.
 * @apiBody {String} email Driver's email.
 * @apiBody {String} phone Driver's phone.
 * @apiBody {String} address Driver's address.
 * @apiBody {String} city Driver's city.
 * @apiBody {String} state Driver's state.
 * @apiBody {String} zip Driver's zip code.
 * @apiBody {String} licenseNumber Driver's license number.
 * @apiBody {String} vehicleMake Driver's vehicle make.
 * @apiBody {String} vehicleModel Driver's vehicle model.
 * @apiBody {Number} vehicleYear Driver's vehicle year.
 * @apiSuccess {Object} driver Created driver object.
 * @apiError ServerError Internal server error.
 */

// POST a new driver
router.post('/', validate(Driver), driverController.createDriver);

/**
 * @api {put} /drivers/:ssn Update driver by SSN
 * @apiName UpdateDriver
 * @apiGroup Driver
 * @apiParam {String} ssn Driver's SSN.
 * @apiBody {String} firstName Driver's first name.
 * @apiBody {String} lastName Driver's last name.
 * @apiBody {String} email Driver's email.
 * @apiBody {String} phone Driver's phone.
 * @apiBody {String} address Driver's address.
 * @apiBody {String} city Driver's city.
 * @apiBody {String} state Driver's state.
 * @apiBody {String} zip Driver's zip code.
 * @apiBody {String} licenseNumber Driver's license number.
 * @apiBody {String} vehicleMake Driver's vehicle make.
 * @apiBody {String} vehicleModel Driver's vehicle model.
 * @apiBody {Number} vehicleYear Driver's vehicle year.
 * @apiSuccess {Object} driver Updated driver object.
 * @apiError NotFound Driver not found.
 * @apiError ServerError Internal server error.
 */

// PUT (update) a driver by SSN
router.put('/:ssn', authMiddleware, validate(Driver), driverController.updateDriver);

/**
 * @api {delete} /drivers/:ssn Delete driver by SSN
 * @apiName DeleteDriver
 * @apiGroup Driver
 * @apiParam {String} ssn Driver's SSN.
 * @apiSuccess (204) Success No content.
 * @apiError NotFound Driver not found.
 * @apiError ServerError Internal server error.
 */

// DELETE a driver by SSN
router.delete('/:ssn', authMiddleware, driverController.deleteDriver);

module.exports = router;

module.exports = router;