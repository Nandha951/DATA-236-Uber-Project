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
    res.json({ status: 'healthy', service: 'driver-service' });
});

// Import routes
const driverRoutes = require('./routes/driver.routes');
const vehicleRoutes = require('./routes/vehicle.routes');
const documentRoutes = require('./routes/document.routes');
const earningsRoutes = require('./routes/earnings.routes');

// Use routes
app.use('/api/drivers', driverRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/earnings', earningsRoutes);

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
const PORT = process.env.PORT || 3006;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Driver Service running on port ${PORT}`);
    });
}

module.exports = app; 