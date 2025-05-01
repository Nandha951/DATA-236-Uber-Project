const sequelize = require('./database'); // Import the shared instance
const { seedDatabase } = require('./seedData');
require('dotenv').config();

// Remove the local sequelize instance creation
// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//     host: process.env.DB_HOST,
//     dialect: 'mysql',
//     dialectOptions: {
//         authPlugins: {
//             default: 'CachingSHA2Password',
//         },
//     },
//     logging: false,
// });

const initializeMySQL = async () => {
    try {
        // Test the connection with retries
        let connected = false;
        let retries = 0;
        const maxRetries = 5;

        while (!connected && retries < maxRetries) {
            try {
                await sequelize.authenticate();
                console.log('MySQL connection has been established successfully.');
                connected = true;
            } catch (error) {
                retries++;
                console.log(`Failed to connect to MySQL (attempt ${retries}/${maxRetries}). Retrying in 5 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }

        if (!connected) {
            throw new Error('Failed to connect to MySQL after multiple attempts');
        }

        // Load models before syncing
        require('../models/associations');

        try {
            // Sync and allow Sequelize to alter existing tables if necessary
            await sequelize.sync({ alter: true });
            console.log('Database synchronized successfully (altered tables if needed).');
        } catch (error) {
            console.log('Initial sync failed, trying to create tables...');
            // If sync fails, try to force create the tables
            await sequelize.sync({ force: true });
            console.log('Database tables created successfully.');
        }

        // Seed the database with initial data
        await seedDatabase();
        console.log('Database seeded successfully.');

        return sequelize;
    } catch (error) {
        console.error('Unable to connect to MySQL database or sync models:', error.message);
        throw error;
    }
};

module.exports = initializeMySQL; 