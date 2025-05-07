const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const driverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    licenseNumber: {
        type: String,
        required: true
    },
    vehicleDetails: {
        make: String,
        model: String,
        year: Number,
        color: String,
        licensePlate: {
            type: String,
            required: true
        }
    },
    currentLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
    status: {
        type: String,
        enum: ['online', 'offline', 'busy'],
        default: 'offline'
    },
    rating: {
        type: Number,
        default: 0
    },
    totalRides: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    documents: [{
        type: {
            type: String,
            enum: ['license', 'insurance', 'registration']
        },
        url: String,
        verified: {
            type: Boolean,
            default: false
        }
    }],
    profileImage: {
        fileId: { type: mongoose.Schema.Types.ObjectId, ref: 'driverImages.files' },
        contentType: { type: String }
    }
}, {
    timestamps: true
});

// Create index for geospatial queries
driverSchema.index({ currentLocation: '2dsphere' });

// Hash password before saving
driverSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Compare password method
driverSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Method to update location
driverSchema.methods.updateLocation = async function (latitude, longitude) {
    this.currentLocation.coordinates = [longitude, latitude];
    return this.save();
};

// Method to update status
driverSchema.methods.updateStatus = async function (status) {
    if (!['online', 'offline', 'busy'].includes(status)) {
        throw new Error('Invalid status');
    }
    this.status = status;
    return this.save();
};

// Method to update rating
driverSchema.methods.updateRating = async function (newRating) {
    const totalRating = (this.rating * this.totalRides) + newRating;
    this.totalRides += 1;
    this.rating = totalRating / this.totalRides;
    return this.save();
};

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver; 