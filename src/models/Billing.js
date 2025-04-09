const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Customer = require('./Customer'); // Import the Customer model

const Billing = sequelize.define('Billing', {
    billingId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    customerSsn: {
        type: DataTypes.STRING(11), // SSN format
        allowNull: false,
        references: {
            model: Customer,
            key: 'ssn'
        }
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false
    },
    billingDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    amount: {
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
    tableName: 'Billing',
    timestamps: true,
    underscored: false,
    indexes: [
        {
            fields: ['customerSsn']
        },
        {
            fields: ['billingDate']
        }
    ]
});

Billing.belongsTo(Customer, { foreignKey: 'customerSsn', as: 'customer' }); // Define the association

module.exports = Billing;