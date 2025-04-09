const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const adminController = require('../controllers/admin.controller');
const validate = require('../middleware/validate.middleware');
const { Admin } = require('../models/associations'); // Assuming you have associations set up

// GET all admins
router.get('/', adminController.getAllAdmins);

// GET an admin by ID
router.get('/:adminId', adminController.getAdminById);

// POST a new admin
router.post('/', adminController.createAdmin);

// PUT (update) an admin by ID
router.put('/:adminId', adminController.updateAdmin);

// DELETE an admin by ID
router.delete('/:adminId', adminController.deleteAdmin);

module.exports = router;