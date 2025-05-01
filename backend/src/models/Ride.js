const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Customer = require('./Customer'); // Import the Customer model
const Driver = require('./Driver'); // Import the Driver model

const Ride = sequelize.define('Ride', {
    rideId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    customerSsn: {
        type: DataTypes.STRING(11), // SSN format (allow dashes)
        allowNull: false,
        references: {
            model: Customer,
            key: 'ssn'
        }
    },
    driverSsn: {
        type: DataTypes.STRING(11), // SSN format (allow dashes)
        allowNull: false,
        references: {
            model: Driver,
            key: 'ssn'
        }
    },
    startLocation: {
        type: DataTypes.STRING,
        allowNull: false
    },
    endLocation: {
        type: DataTypes.STRING,
        allowNull: false
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: true
    },
    fare: {
        type: DataTypes.DECIMAL(10, 2),
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
    tableName: 'Rides',
    timestamps: true,
    underscored: false,
    indexes: [
        {
            fields: ['customerSsn']
        },
        {
            fields: ['driverSsn']
        },
        {
            fields: ['startTime', 'endTime']
        }
    ]
});

Ride.belongsTo(Customer, { foreignKey: 'customerSsn', as: 'customer' }); // Define the association
Ride.belongsTo(Driver, { foreignKey: 'driverSsn', as: 'driver' }); // Define the association

module.exports = Ride;