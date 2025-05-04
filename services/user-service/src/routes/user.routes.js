const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Validation middleware
const userValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('phoneNumber').notEmpty().withMessage('Phone number is required'),
    body('userType').isIn(['customer', 'driver']).withMessage('Invalid user type')
];

const updateValidation = [
    body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
    body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
    body('phoneNumber').optional().notEmpty().withMessage('Phone number cannot be empty'),
    body('profilePicture').optional().isURL().withMessage('Invalid profile picture URL')
];

// Public routes
router.post('/', userValidation, userController.createUser);

// Protected routes
router.get('/', authMiddleware, userController.getAllUsers);
router.get('/:id', authMiddleware, userController.getUserById);
router.put('/:id', authMiddleware, updateValidation, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);

module.exports = router; 