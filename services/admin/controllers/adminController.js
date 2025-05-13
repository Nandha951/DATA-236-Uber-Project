const axios = require('axios');
const Administrator = require('../models/administrator');

// Helper function to validate SSN
const validateSSN = (ssn) => {
    const ssnRegex = /^(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0000)\d{4}$/;
    return ssnRegex.test(ssn);
};

// Admin Signup
exports.signup = async (req, res) => {
    try {
        const { adminId, password, ...adminData } = req.body;

        if (!validateSSN(adminId)) {
            return res.status(400).json({ message: 'Invalid SSN format' });
        }

        const existingAdmin = await Administrator.findOne({ adminId });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const admin = new Administrator({ adminId, ...adminData, password });
        await admin.save();

        const adminResponse = admin.toObject();
        delete adminResponse.password;

        res.status(201).json({ message: 'Admin registered successfully', admin: adminResponse });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Admin Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Administrator.findOne({ email });
        if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        admin.lastLogin = Date.now();
        await admin.save();

        const adminResponse = admin.toObject();
        delete adminResponse.password;

        res.json({ message: 'Login successful', admin: adminResponse });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add Driver (calls drivers-service)
exports.addDriver = async (req, res) => {
    try {
      const response = await axios.post(
        'http://localhost:4002/api/drivers/signup', // ✅ Replace with actual driver-service port
        req.body
      );
  
      res.status(201).json(response.data);
    } catch (error) {
      console.error('[Admin AddDriver Error]', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({
        message: 'Error adding driver',
        error: error.response?.data || error.message
      });
    }
  };

// Add Customer (calls customers-service)
exports.addCustomer = async (req, res) => {
    try {
        const response = await axios.post('http://localhost:4003/api/customers/signup', req.body);
        res.status(201).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: 'Error adding customer',
            error: error.response?.data || error.message
        });
    }
};

// Review Driver (calls drivers, rides services)
exports.reviewDriver = async (req, res) => {
    try {
        const driverId = req.params.driverId;

        const [driverRes, ridesRes] = await Promise.all([
            axios.get(`http://localhost:4002/api/drivers/${driverId}`),
            axios.get(`http://localhost:4001/api/rides/driver/${driverId}`)
        ]);

        const rides = ridesRes.data;
        const statistics = {
            totalRides: rides.length,
            completedRides: rides.filter(r => r.status === 'completed').length,
            totalEarnings: rides.reduce((sum, r) => sum + (r.actualPrice || 0), 0),
            averageRating: driverRes.data.rating || 0,
            rideHistory: rides.map(r => ({
                rideId: r.rideId,
                date: r.dateTime,
                status: r.status,
                amount: r.actualPrice
            }))
        };

        res.json({ driver: driverRes.data, statistics });
    } catch (error) {
        res.status(500).json({ message: 'Failed to review driver', error: error.message });
    }
};

// Review Customer (calls customers, rides services)
exports.reviewCustomer = async (req, res) => {
    try {
        const customerId = req.params.customerId;

        const [customerRes, ridesRes] = await Promise.all([
            axios.get(`http://localhost:4003/api/customers/${customerId}`),
            axios.get(`http://localhost:4001/api/rides/customer/${customerId}`)
        ]);

        const rides = ridesRes.data;
        const statistics = {
            totalRides: rides.length,
            totalSpent: rides.reduce((sum, r) => sum + (r.actualPrice || 0), 0),
            averageRating: rides.reduce((sum, r) => sum + (r.rating || 0), 0) / rides.length || 0,
            rideHistory: rides.map(r => ({
                rideId: r.rideId,
                date: r.dateTime,
                status: r.status,
                amount: r.actualPrice
            }))
        };

        res.json({ customer: customerRes.data, statistics });
    } catch (error) {
        res.status(500).json({ message: 'Failed to review customer', error: error.message });
    }
};

// Get Revenue Stats (from rides-service)
exports.getRevenueStatistics = async (req, res) => {
    try {
        const response = await axios.get('http://localhost:4001/api/rides/statistics', { params: req.query });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get revenue stats', error: error.message });
    }
};

// Get Ride Statistics for Charts (from rides-service)
exports.getRideStatistics = async (req, res) => {
    try {
        const response = await axios.get('http://localhost:4001/api/rides/statistics', { params: req.query });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get ride stats', error: error.message });
    }
};

// Search Bills (from billing-service)
exports.searchBills = async (req, res) => {
    try {
        const response = await axios.get('http://localhost:4004/api/billing/search', { params: req.query });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Failed to search bills', error: error.message });
    }
};

// Get Bill Details (from billing-service)
exports.getBillDetails = async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:4004/api/billing/${req.params.billId}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get bill details', error: error.message });
    }
};
