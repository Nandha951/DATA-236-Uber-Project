const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Driver = sequelize.define('Driver', {
    ssn: {
        type: DataTypes.STRING(9), // SSN format
        primaryKey: true,
        allowNull: false,
        validate: {
            is: /^\d{3}-?\d{2}-?\d{4}$/ // SSN format validation
        }
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: DataTypes.STRING(2),
        allowNull: false,
        validate: {
            isIn: [['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']]
        }
    },
    zip: {
        type: DataTypes.STRING(5),
        allowNull: false,
        validate: {
            is: /^\d{5}$/ // Zip code format validation
        }
    },
    licenseNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    vehicleMake: {
        type: DataTypes.STRING,
        allowNull: false
    },
    vehicleModel: {
        type: DataTypes.STRING,
        allowNull: false
    },
    vehicleYear: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'Drivers',
    timestamps: true,
    underscored: false,
    indexes: [
        {
            fields: ['firstName', 'lastName']
        },
        {
            fields: ['state', 'city']
        }
    ]
});

module.exports = Driver;