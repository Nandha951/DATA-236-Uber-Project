const { Driver } = require('../models/associations');

const seedDrivers = [
    {
        ssn: "123-45-6789",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "555-123-4567",
        address: "123 Main St",
        city: "Anytown",
        state: "CA",
        zip: "91234",
        licenseNumber: "DL12345",
        vehicleMake: "Toyota",
        vehicleModel: "Camry",
        vehicleYear: 2020
    },
    {
        ssn: "987-65-4321",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        phone: "555-987-6543",
        address: "456 Oak Ave",
        city: "Somewhere",
        state: "NY",
        zip: "10001",
        licenseNumber: "DL67890",
        vehicleMake: "Honda",
        vehicleModel: "Civic",
        vehicleYear: 2021
    }
];

const seedDatabase = async () => {
    try {
        // Create drivers
        for (const driverData of seedDrivers) {
            await Driver.findOrCreate({
                where: { ssn: driverData.ssn },
                defaults: driverData
            });
        }
        console.log('Seed data inserted successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
};

module.exports = { seedDatabase }; 