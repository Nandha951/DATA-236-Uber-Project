require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const customerRoutes = require('./routes/customerRoutes');
const cors = require('cors');

const app = express();
connectDB();

app.use(express.json());
app.use(cors());
app.use('/api/customers', customerRoutes);

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
    console.log(`👤 Customers Service running on port ${PORT}`);
});
