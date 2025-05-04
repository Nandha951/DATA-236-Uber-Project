const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'payment-service' });
});

// Import routes
const paymentRoutes = require('./routes/payment.routes');
const walletRoutes = require('./routes/wallet.routes');
const transactionRoutes = require('./routes/transaction.routes');

// Use routes
app.use('/api/payments', paymentRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/transactions', transactionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Start server
const PORT = process.env.PORT || 3005;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Payment Service running on port ${PORT}`);
    });
}

module.exports = app; 