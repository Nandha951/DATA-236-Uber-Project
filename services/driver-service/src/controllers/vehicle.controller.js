const Vehicle = require('../models/vehicle.model');
const Driver = require('../models/driver.model');

exports.registerVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.create({
            driverId: req.user.id,
            ...req.body
        });

        // Update driver's vehicle reference
        await Driver.findOneAndUpdate(
            { userId: req.user.id },
            { vehicleId: vehicle._id }
        );

        res.status(201).json({
            status: 'success',
            data: vehicle
        });
    } catch (error) {
        console.error('Error registering vehicle:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to register vehicle',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
};

exports.getDriverVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ driverId: req.user.id });

        res.status(200).json({
            status: 'success',
            data: vehicles
        });
    } catch (error) {
        console.error('Error fetching driver vehicles:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch driver vehicles',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
};

exports.updateVehicle = async (req, res) => {
    try {
        const { vehicleId } = req.params;
        const vehicle = await Vehicle.findOneAndUpdate(
            { _id: vehicleId, driverId: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!vehicle) {
            return res.status(404).json({
                status: 'error',
                message: 'Vehicle not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: vehicle
        });
    } catch (error) {
        console.error('Error updating vehicle:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to update vehicle',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
};

exports.getVehicleDetails = async (req, res) => {
    try {
        const { vehicleId } = req.params;
        const vehicle = await Vehicle.findOne({
            _id: vehicleId,
            driverId: req.user.id
        });

        if (!vehicle) {
            return res.status(404).json({
                status: 'error',
                message: 'Vehicle not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: vehicle
        });
    } catch (error) {
        console.error('Error fetching vehicle details:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch vehicle details',
            error: process.env.NODE_ENV === 'development' ? error.message : {}
        });
    }
}; 