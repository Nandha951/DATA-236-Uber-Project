const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Customer = require('../models/Customer');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register new customer
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, address, city, state, zip, ssn } = req.body;

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new customer
    const customer = new Customer({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      address,
      city,
      state,
      zip,
      ssn
    });

    await customer.save();

    // Generate JWT
    const token = jwt.sign(
      { id: customer._id, email: customer.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      customer: {
        id: customer._id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login customer
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if customer exists
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, customer.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: customer._id, email: customer.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      customer: {
        id: customer._id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 