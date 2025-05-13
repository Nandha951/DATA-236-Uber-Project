const Billing = require('../models/billing');
const { client } = require('../redisClient'); // ✅ Redis client

// Generate Bill
exports.generateBill = async (req, res) => {
    try {
        const { rideId } = req.params;
        const rideData = req.body;

        const existingBill = await Billing.findOne({ rideId });
        if (existingBill) {
            return res.status(400).json({ message: 'Bill already exists for this ride' });
        }

        const billing = new Billing({
            billingId: `BILL-${Date.now()}`,
            date: new Date(),
            pickupTime: rideData.dateTime,
            dropoffTime: new Date(),
            distanceCovered: rideData.actualDistance,
            totalAmount: rideData.actualPrice,
            sourceLocation: rideData.pickupLocation,
            destinationLocation: rideData.dropoffLocation,
            driverId: rideData.driverId,
            customerId: rideData.customerId,
            predictedPrice: rideData.estimatedPrice,
            actualPrice: rideData.actualPrice,
            status: 'completed',
            paymentMethod: 'credit_card'
        });

        await billing.save();
        // ❌ Invalidate customer bill cache
        await client.del(`customerBills:${billing.customerId}`);

        res.status(201).json(billing);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get All Bills
exports.getAllBills = async (req, res) => {
    try {
        const bills = await Billing.find();
        res.json(bills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Bill by ID
exports.getBillById = async (req, res) => {
    try {
        const bill = await Billing.findOne({ billingId: req.params.id });
        if (!bill) return res.status(404).json({ message: 'Bill not found' });
        res.json(bill);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Get Bills by Customer ID — with Redis Caching
exports.getBillsByCustomerId = async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const cacheKey = `customerBills:${customerId}`;

        const cached = await client.get(cacheKey);
        if (cached) {
            console.log('✅ Redis: Returning cached bills for customer');
            return res.json(JSON.parse(cached));
        }

        const bills = await Billing.find({ customerId });
        await client.setEx(cacheKey, 60, JSON.stringify(bills)); // TTL 60s
        console.log('⏱️ Redis: Cached bills for customer for 60s');

        res.json(bills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Bills by Driver ID
exports.getBillsByDriverId = async (req, res) => {
    try {
        const bills = await Billing.find({ driverId: req.params.driverId });
        res.json(bills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Update Bill Status — Invalidate Cache
exports.updateBillStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const bill = await Billing.findOneAndUpdate(
            { billingId: req.params.id },
            { status },
            { new: true, runValidators: true }
        );

        if (!bill) return res.status(404).json({ message: 'Bill not found' });

        // ❌ Invalidate cache
        await client.del(`customerBills:${bill.customerId}`);

        res.json(bill);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// ✅ Delete Bill — Invalidate Cache
exports.deleteBill = async (req, res) => {
    try {
        const bill = await Billing.findOneAndDelete({ billingId: req.params.id });
        if (!bill) return res.status(404).json({ message: 'Bill not found' });

        // ❌ Invalidate cache
        await client.del(`customerBills:${bill.customerId}`);

        res.json({ message: 'Bill deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search Bills
exports.searchBills = async (req, res) => {
    try {
        const {
            customerId, driverId, startDate, endDate, minAmount, maxAmount, status
        } = req.query;

        const query = {};
        if (customerId) query.customerId = customerId;
        if (driverId) query.driverId = driverId;
        if (status) query.status = status;

        if (startDate || endDate) {
            query.date = {};
            if (startDate) {
                const start = new Date(startDate);
                if (isNaN(start.getTime())) return res.status(400).json({ message: 'Invalid start date format' });
                start.setHours(0, 0, 0, 0);
                query.date.$gte = start;
            }
            if (endDate) {
                const end = new Date(endDate);
                if (isNaN(end.getTime())) return res.status(400).json({ message: 'Invalid end date format' });
                end.setHours(23, 59, 59, 999);
                query.date.$lte = end;
            }
        }

        if (minAmount || maxAmount) {
            query.totalAmount = {};
            if (minAmount) {
                const min = parseFloat(minAmount);
                if (isNaN(min)) return res.status(400).json({ message: 'Invalid minimum amount' });
                query.totalAmount.$gte = min;
            }
            if (maxAmount) {
                const max = parseFloat(maxAmount);
                if (isNaN(max)) return res.status(400).json({ message: 'Invalid maximum amount' });
                query.totalAmount.$lte = max;
            }
        }

        const bills = await Billing.find(query);

        res.json({
            message: bills.length > 0 ? 'Bills found successfully' : 'No bills found for the specified criteria',
            count: bills.length,
            bills
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error searching bills',
            error: error.message
        });
    }
};


