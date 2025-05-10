const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const authController = require('../controllers/auth.controller');
const verifyToken = require('../middleware/auth.middleware');
const Customer = require('../models/Customer');
// const Ride = require('../../ride-service/models/Ride'); // adjust path as needed
// const { getRidesByCustomer } = require('../controllers/customer.controller');
// Create Customer
router.post('/', customerController.createCustomer);
// Get all Customers
router.get('/', verifyToken, customerController.getCustomers);
// Get Customer by ID
router.get('/:id', verifyToken, customerController.getCustomerById);
// Update Customer
router.put('/:id', verifyToken, customerController.updateCustomer);
// Delete Customer
router.delete('/:id', verifyToken, customerController.deleteCustomer);
// Get rides for a customer
// router.get('/customers/:id/rides', getRidesByCustomer);




// Get rides for a customer
// const Ride = require('../models/Ride');

// router.get('/:id/rides', async (req, res) => {
//   try {
//     const rides = await Ride.find({ customerId: req.params.id }).populate('driverId', 'firstName lastName email');
//     res.json(rides);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// Upload image for a ride
const uploadController = require('../controllers/upload.controller');

router.post(
  '/rides/:rideId/upload-image',
  verifyToken,
  uploadController.uploadMiddleware,
  uploadController.uploadImage
);


// const Driver = require('../models/Driver');

// Get nearby drivers for a customer
router.get('/:id/nearby-drivers', async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) return res.status(400).json({ error: 'Coordinates missing' });

  try {
    const nearbyDrivers = await Driver.find({
      location: {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: 16093 // ~10 miles in meters
        }
      }
    });

    res.json(nearbyDrivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update customer credit card information
router.put('/:id/credit-card', verifyToken, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { creditCard: req.body },
      { new: true }
    );
    res.json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add review for a ride
router.post('/:id/reviews', verifyToken, async (req, res) => {
  try {
    const { rideId, comment } = req.body;
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    customer.reviews.push({ rideId, comment });
    await customer.save();

    res.status(201).json({ message: 'Review added' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Auth routes (unprotected)
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;