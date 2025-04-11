const Customer = require('./Customer');
const Driver = require('./Driver');
const Billing = require('./Billing');
const Ride = require('./Ride');

// Define associations
Customer.hasMany(Billing, { foreignKey: 'customerSsn', as: 'billings' });
Customer.hasMany(Ride, { foreignKey: 'customerSsn', as: 'rides' });
Driver.hasMany(Ride, { foreignKey: 'driverSsn', as: 'rides' });

Billing.belongsTo(Customer, { foreignKey: 'customerSsn', as: 'customerBilling' });
Ride.belongsTo(Customer, { foreignKey: 'customerSsn', as: 'customerRide' });
Ride.belongsTo(Driver, { foreignKey: 'driverSsn', as: 'driverRide' });

module.exports = { Customer, Driver, Billing, Ride };