const axios = require('axios');
const Customer = require('../models/customer');

// SSN Validator
const validateSSN = ssn => {
    const ssnRegex = /^(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0000)\d{4}$/;
    return ssnRegex.test(ssn);
};

// Customer Signup
exports.signup = async (req, res) => {
    try {
        const { customerId, password, ...customerData } = req.body;

        if (!validateSSN(customerId)) {
            return res.status(400).json({ message: 'Invalid SSN format' });
        }

        const existingCustomer = await Customer.findOne({ customerId });
        if (existingCustomer) {
            return res.status(400).json({ message: 'Customer already exists' });
        }

        const customer = new Customer({ customerId, ...customerData, password });
        await customer.save();

        const customerResponse = customer.toObject();
        delete customerResponse.password;

        res.status(201).json({
            message: 'Customer registered',
            customer: customerResponse
        });
    } catch (error) {
        console.error('[SIGNUP ERROR]', error);
        res.status(400).json({ message: error.message });

    }
};

// Customer Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const customer = await Customer.findOne({ email });

        if (!customer) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await customer.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        customer.lastLogin = Date.now();
        await customer.save();

        const customerResponse = customer.toObject();
        delete customerResponse.password;

        res.json({
            message: 'Login successful',
            customer: customerResponse
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Customer
exports.deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findOneAndDelete({ customerId: req.params.id });
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Customers
exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Customer by ID
exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findOne({ customerId: req.params.id });
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🔁 Generate Bill — call billing-service
exports.generateBill = async (req, res) => {
    try {
        const rideId = req.params.rideId;
        const rideData = req.body;

        const response = await axios.post(`http://localhost:4004/api/billing/rides/${rideId}`, rideData);
        res.status(201).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: 'Failed to generate bill',
            error: error.response?.data || error.message
        });
    }
};

// 🔁 Find Nearby Drivers — call drivers-service
exports.findNearbyDrivers = async (req, res) => {
    try {
        const { latitude, longitude } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({ message: 'Latitude and longitude are required' });
        }

        const response = await axios.get('http://localhost:4002/api/drivers/nearby', {
            params: { latitude, longitude }
        });

        res.json({
            message: 'Nearby drivers retrieved successfully',
            drivers: response.data.drivers
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch nearby drivers',
            error: error.message
        });
    }
};

// 🔁 Upload Ride Images — call rides-service
exports.uploadRideImages = async (req, res) => {
    try {
        const { rideId } = req.params;
        const { images } = req.body;

        const response = await axios.post(`http://localhost:4001/api/rides/${rideId}/images`, {
            images
        });

        res.json({
            message: 'Images uploaded successfully to ride',
            result: response.data
        });
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: 'Failed to upload ride images',
            error: error.response?.data || error.message
        });
    }
};

// Update Customer
exports.updateCustomer = async (req, res) => {
    try {
        const updateData = { ...req.body };
        // Prevent password update unless explicitly provided
        if (!updateData.password) delete updateData.password;
        const updatedCustomer = await Customer.findOneAndUpdate(
            { customerId: req.params.id },
            updateData,
            { new: true }
        );
        if (!updatedCustomer) return res.status(404).json({ message: 'Customer not found' });
        const customerResponse = updatedCustomer.toObject();
        delete customerResponse.password;
        res.json(customerResponse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

