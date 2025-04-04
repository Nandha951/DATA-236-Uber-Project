const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    dialectOptions: {
        authPlugins: {
            default: 'CachingSHA2Password',
        },
    },
    logging: false,
});

const initializeMySQL = async () => {
    try {
        // Test the connection
        await sequelize.authenticate();
        console.log('MySQL connection has been established successfully.');

        await sequelize.sync({ alter: true });
        console.log('All models were synchronized successfully.');

        return sequelize;
    } catch (error) {
        console.error('Unable to connect to MySQL database:', error);
        throw error;
    }
};

module.exports = initializeMySQL; 