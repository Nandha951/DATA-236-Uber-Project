const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Transaction = require('../models/transaction.model');
const Wallet = require('../models/wallet.model');

exports.processPayment = async (req, res) => {
    try {
        const { amount, currency, paymentMethod, rideId } = req.body;
        const userId = req.user.id;

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to cents
            currency,
            payment_method: paymentMethod,
            confirm: true,
            metadata: {
                userId,
                rideId
            }
        });

        // Create transaction record
        const transaction = await Transaction.create({
            userId,
            type: 'DEBIT',
            amount,
            currency,
            status: 'COMPLETED',
            rideId,
            paymentMethod: 'CARD',
            metadata: {
                stripePaymentId: paymentIntent.id
            }
        });

        res.status(200).json({
            status: 'success',
            data: {
                transaction,
                paymentIntent
            }
        });
    } catch (error) {
        console.error('Payment processing error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Payment processing failed',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
};

exports.processRefund = async (req, res) => {
    try {
        const { transactionId } = req.params;
        const transaction = await Transaction.findById(transactionId);

        if (!transaction) {
            return res.status(404).json({
                status: 'error',
                message: 'Transaction not found'
            });
        }

        // Process refund with Stripe
        const refund = await stripe.refunds.create({
            payment_intent: transaction.metadata.get('stripePaymentId')
        });

        // Update transaction status
        transaction.status = 'REFUNDED';
        await transaction.save();

        res.status(200).json({
            status: 'success',
            data: {
                transaction,
                refund
            }
        });
    } catch (error) {
        console.error('Refund processing error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Refund processing failed',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
};

exports.getPaymentMethods = async (req, res) => {
    try {
        const userId = req.user.id;
        const paymentMethods = await stripe.paymentMethods.list({
            customer: userId,
            type: 'card'
        });

        res.status(200).json({
            status: 'success',
            data: paymentMethods
        });
    } catch (error) {
        console.error('Error fetching payment methods:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch payment methods',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
};

exports.addPaymentMethod = async (req, res) => {
    try {
        const { paymentMethodId } = req.body;
        const userId = req.user.id;

        // Attach payment method to customer
        await stripe.paymentMethods.attach(paymentMethodId, {
            customer: userId
        });

        res.status(200).json({
            status: 'success',
            message: 'Payment method added successfully'
        });
    } catch (error) {
        console.error('Error adding payment method:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to add payment method',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
}; 