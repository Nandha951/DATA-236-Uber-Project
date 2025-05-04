const Wallet = require('../models/wallet.model');
const Transaction = require('../models/transaction.model');

exports.getWallet = async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ userId: req.user.id });
        
        if (!wallet) {
            return res.status(404).json({
                status: 'error',
                message: 'Wallet not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: wallet
        });
    } catch (error) {
        console.error('Error fetching wallet:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch wallet',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
};

exports.topUpWallet = async (req, res) => {
    try {
        const { amount, currency } = req.body;
        const userId = req.user.id;

        let wallet = await Wallet.findOne({ userId });
        
        if (!wallet) {
            wallet = await Wallet.create({
                userId,
                balance: 0,
                currency
            });
        }

        // Create transaction
        const transaction = await Transaction.create({
            userId,
            type: 'CREDIT',
            amount,
            currency,
            status: 'COMPLETED',
            paymentMethod: 'WALLET',
            description: 'Wallet top-up'
        });

        // Update wallet balance
        wallet.balance += amount;
        wallet.lastUpdated = new Date();
        await wallet.save();

        res.status(200).json({
            status: 'success',
            data: {
                wallet,
                transaction
            }
        });
    } catch (error) {
        console.error('Error topping up wallet:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to top up wallet',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
};

exports.withdrawFromWallet = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.user.id;

        const wallet = await Wallet.findOne({ userId });
        
        if (!wallet) {
            return res.status(404).json({
                status: 'error',
                message: 'Wallet not found'
            });
        }

        if (wallet.balance < amount) {
            return res.status(400).json({
                status: 'error',
                message: 'Insufficient balance'
            });
        }

        // Create transaction
        const transaction = await Transaction.create({
            userId,
            type: 'DEBIT',
            amount,
            currency: wallet.currency,
            status: 'COMPLETED',
            paymentMethod: 'WALLET',
            description: 'Wallet withdrawal'
        });

        // Update wallet balance
        wallet.balance -= amount;
        wallet.lastUpdated = new Date();
        await wallet.save();

        res.status(200).json({
            status: 'success',
            data: {
                wallet,
                transaction
            }
        });
    } catch (error) {
        console.error('Error withdrawing from wallet:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to withdraw from wallet',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
};

exports.getWalletTransactions = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const userId = req.user.id;

        const transactions = await Transaction.find({ userId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Transaction.countDocuments({ userId });

        res.status(200).json({
            status: 'success',
            data: {
                transactions,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Error fetching wallet transactions:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch wallet transactions',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
}; 