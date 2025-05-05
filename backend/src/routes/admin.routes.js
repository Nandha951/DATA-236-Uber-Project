const express = require('express');
const router = express.Router();
const { authMiddleware, authorize } = require('../middleware/auth.middleware');
const adminController = require('../controllers/admin.controller');
const validate = require('../middleware/validate.middleware');
const { Admin } = require('../models/associations'); // Assuming you have associations set up

// Create initial admin user (no auth required)
router.post('/init', async (req, res) => {
    try {
        const admin = await adminController.createInitialAdmin();
        res.status(201).json({
            status: 'success',
            message: 'Initial admin created successfully',
            data: admin
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// GET all admins
router.get('/', authMiddleware, authorize('admin'), adminController.getAllAdmins);

// GET an admin by ID
router.get('/:adminId', authMiddleware, authorize('admin'), adminController.getAdminById);

// POST a new admin
router.post('/', authMiddleware, authorize('admin'), adminController.createAdmin);

// PUT (update) an admin by ID
router.put('/:adminId', authMiddleware, authorize('admin'), adminController.updateAdmin);

// DELETE an admin by ID
router.delete('/:adminId', authMiddleware, authorize('admin'), adminController.deleteAdmin);

module.exports = router;