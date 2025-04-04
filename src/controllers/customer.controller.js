const { Customer } = require('../models/associations'); // Assuming you have associations set up

// GET all customers
exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll();
        res.status(200).json(customers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET a customer by SSN
exports.getCustomerBySsn = async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.ssn);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json(customer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// POST a new customer
exports.createCustomer = async (req, res) => {
    try {
        const customer = await Customer.create(req.body);
        res.status(201).json(customer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// PUT (update) a customer by SSN
exports.updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.ssn);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        await customer.update(req.body);
        res.status(200).json(customer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// DELETE a customer by SSN
exports.deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.ssn);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        await customer.destroy();
        res.status(204).send(); // No content
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};