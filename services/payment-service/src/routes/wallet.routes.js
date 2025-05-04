const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Wallet management routes
router.get('/', authMiddleware, walletController.getWallet);
router.post('/topup', authMiddleware, walletController.topUpWallet);
router.post('/withdraw', authMiddleware, walletController.withdrawFromWallet);
router.get('/transactions', authMiddleware, walletController.getWalletTransactions);

module.exports = router; 