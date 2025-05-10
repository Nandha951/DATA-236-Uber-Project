const Ride = require('../models/Ride');
const geolib = require('geolib');
const Driver = require('../models/Driver');
const redis = require('redis');
const client = redis.createClient({ url: 'redis://redis:6379' });
client.connect();

// Create Ride
exports.createRide = async (req, res) => {
  try {
    const ride = new Ride(req.body);
    await ride.save();
    res.status(201).json(ride);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all Rides
exports.getRides = async (req, res) => {
  try {
    const rides = await Ride.find();
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Ride by ID
exports.getRideById = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ error: 'Ride not found' });
    res.json(ride);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Ride
exports.updateRide = async (req, res) => {
  try {
    const ride = await Ride.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ride) return res.status(404).json({ error: 'Ride not found' });
    res.json(ride);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Ride
exports.deleteRide = async (req, res) => {
  try {
    const ride = await Ride.findByIdAndDelete(req.params.id);
    if (!ride) return res.status(404).json({ error: 'Ride not found' });
    res.json({ message: 'Ride deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 

// Get rides by Customer ID
exports.getRidesByCustomer = async (req, res) => {
  const customerId = req.params.customerId;
  const cacheKey = `rides:customer:${customerId}`;
  try {
    // Try to get from cache
    const cached = await client.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    // Not in cache, fetch from DB
    const rides = await Ride.find({ customerId })
      .populate('driverId', 'name phone')
      .sort({ createdAt: -1 });
    // Cache the result for 60 seconds
    await client.set(cacheKey, JSON.stringify(rides), { EX: 60 });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get rides by Driver ID
exports.getRidesByDriver = async (req, res) => {
  try {
    const rides = await Ride.find({ driverId: req.params.driverId })
      .populate('customerId', 'name phone')
      .sort({ createdAt: -1 });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get ride statistics per pickup location
exports.getRideStatisticsByLocation = async (req, res) => {
  try {
    const rides = await Ride.find();

    const stats = {};

    rides.forEach(ride => {
      const lat = ride.pickup.latitude.toFixed(2);
      const lng = ride.pickup.longitude.toFixed(2);
      const key = `${lat},${lng}`;

      stats[key] = (stats[key] || 0) + 1;
    });

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Ride Statistics by Location
exports.getRideStatistics = async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.query;
    const stats = await Ride.aggregate([
      {
        $match: {
          'pickup.latitude': {
            $gte: parseFloat(latitude) - parseFloat(radius),
            $lte: parseFloat(latitude) + parseFloat(radius)
          },
          'pickup.longitude': {
            $gte: parseFloat(longitude) - parseFloat(radius),
            $lte: parseFloat(longitude) + parseFloat(radius)
          }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalFare: { $sum: '$fare' }
        }
      }
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Simulated drivers — replace with DB query in future
const drivers = [
  { driverId: '111', latitude: 37.7749, longitude: -122.4194 },
  { driverId: '222', latitude: 37.7849, longitude: -122.4094 },
  { driverId: '333', latitude: 37.8049, longitude: -122.4294 },
];

// Get drivers within 10 miles of a customer location
exports.getNearbyDrivers = async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Missing latitude or longitude' });
  }

  const customerLocation = {
    latitude: parseFloat(lat),
    longitude: parseFloat(lng)
  };

  const nearbyDrivers = drivers.filter(driver =>
    geolib.getDistance(customerLocation, {
      latitude: driver.latitude,
      longitude: driver.longitude
    }) <= 16093.4 // 10 miles in meters
  );

  res.json(nearbyDrivers);
};

// Find Nearby Drivers
exports.findNearbyDrivers = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;
    const customerLocation = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    };

    // Get all active drivers
    const drivers = await Driver.find({ status: 'available' });
    
    // Filter drivers within radius
    const nearbyDrivers = drivers.filter(driver => {
      const distance = geolib.getDistance(
        customerLocation,
        { latitude: driver.location.latitude, longitude: driver.location.longitude }
      );
      return distance <= radius * 1609.34; // Convert miles to meters
    });

    res.json(nearbyDrivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
