import axios from 'axios';

const BASE_URL = 'http://localhost:4004/api/billing';

// Get billing info for a driver
export const getBillingByDriver = async (driverId) => {
  const res = await axios.get(`${BASE_URL}/driver/${driverId}`);
  return res.data;
};

// Get billing info for a customer
export const getBillingByCustomer = async (customerId) => {
  const res = await axios.get(`${BASE_URL}/customer/${customerId}`);
  return res.data;
};
