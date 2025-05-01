const { Ride, Customer, Driver } = require('../models/associations');
const sequelize = require('../config/database');
const { producer } = require('../config/kafka');

// GET all rides
exports.getAllRides = async (req, res) => {
    try {
        const rides = await Ride.findAll();
        res.status(200).json(rides);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET a ride by ID
exports.getRideById = async (req, res) => {
    try {
        const ride = await Ride.findByPk(req.params.rideId);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }
        res.status(200).json(ride);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// POST a new ride
const pricingAlgorithm = require('../utils/pricing');

exports.createRide = async (req, res) => {
    try {
        // Calculate the fare using the dynamic pricing algorithm
        const fare = pricingAlgorithm.getPredictedFare(
            req.body.startLocation,
            req.body.endLocation,
            req.body.startTime
        );

        const t = await sequelize.transaction();

        try {
            // Validate foreign keys first
            const customer = await Customer.findByPk(req.body.customerSsn, { transaction: t });
            if (!customer) {
                await t.rollback();
                return res.status(400).json({ message: 'Invalid customerSsn – customer not found' });
            }
            const driver = await Driver.findByPk(req.user?.ssn || req.body.driverSsn, { transaction: t });
            if (!driver) {
                await t.rollback();
                return res.status(400).json({ message: 'Invalid driverSsn – driver not found' });
            }

            const ride = await Ride.create({
                driverSsn: driver.ssn,
                customerSsn: customer.ssn,
                startLocation: req.body.startLocation,
                endLocation: req.body.endLocation,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                fare: fare,
            }, { transaction: t });

            await t.commit();

            // Try to send Kafka message, but don't fail the request if Kafka is down or topic missing
            try {
                await producer.send({
                    topic: 'ride.requested',
                    messages: [
                        { value: JSON.stringify(ride) },
                    ],
                });
            } catch (kErr) {
                console.warn('Kafka produce failed, continuing without blocking ride creation:', kErr.message);
            }

            return res.status(201).json(ride);
        } catch (error) {
            await t.rollback();
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// PUT (update) a ride by ID
exports.updateRide = async (req, res) => {
    try {
        const ride = await Ride.findByPk(req.params.rideId);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }
        await ride.update(req.body);
        res.status(200).json(ride);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// DELETE a ride by ID
exports.deleteRide = async (req, res) => {
    try {
        const ride = await Ride.findByPk(req.params.rideId);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }
        await ride.destroy();
        res.status(204).send(); // No content
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};