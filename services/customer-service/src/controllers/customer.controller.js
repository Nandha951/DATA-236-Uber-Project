const Customer = require('../models/Customer');
const redis = require('redis');
const client = redis.createClient({ url: 'redis://redis:6379' });
client.connect();

// Create Customer
exports.createCustomer = async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all Customers
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Customer by ID
exports.getCustomerById = async (req, res) => {
  const customerId = req.params.id;
  const cacheKey = `customer:${customerId}`;
  try {
    const cached = await client.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    await client.set(cacheKey, JSON.stringify(customer), { EX: 120 }); // cache for 2 minutes
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Customer
exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    // Invalidate cache
    const cacheKey = `customer:${req.params.id}`;
    await client.del(cacheKey);
    res.json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Customer
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 


// const Ride = require('../models/Ride'); 
// const getRidesByCustomer = async (req, res) => {
//   try {
//     const customerId = req.params.id;
//     const rides = await Ride.find({ customerId });

//     res.status(200).json(rides);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// module.exports = { getRidesByCustomer };