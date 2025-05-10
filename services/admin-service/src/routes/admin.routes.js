const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

// Create Admin
router.post('/', adminController.createAdmin);
// Get all Admins
router.get('/', adminController.getAdmins);
// Get Admin by ID
router.get('/:id', adminController.getAdminById);
// Update Admin
router.put('/:id', adminController.updateAdmin);
// Delete Admin
router.delete('/:id', adminController.deleteAdmin);

module.exports = router; 