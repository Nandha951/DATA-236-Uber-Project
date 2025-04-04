const { Admin } = require('../models/associations'); // Assuming you have associations set up

// GET all admins
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.findAll();
        res.status(200).json(admins);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET an admin by ID
exports.getAdminById = async (req, res) => {
    try {
        const admin = await Admin.findByPk(req.params.adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json(admin);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// POST a new admin
exports.createAdmin = async (req, res) => {
    try {
        const admin = await Admin.create(req.body);
        res.status(201).json(admin);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// PUT (update) an admin by ID
exports.updateAdmin = async (req, res) => {
    try {
        const admin = await Admin.findByPk(req.params.adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        await admin.update(req.body);
        res.status(200).json(admin);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// DELETE an admin by ID
exports.deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findByPk(req.params.adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        await admin.destroy();
        res.status(204).send(); // No content
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};