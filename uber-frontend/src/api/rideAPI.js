// src/api/rideAPI.js
import axios from 'axios';

const BASE_URL = 'http://localhost:4001/api/rides';

// 📥 Create a ride (customer)
export const createRide = async (rideData) => {
  const res = await axios.post(BASE_URL, rideData);
  return res.data;
};

// 👀 Get rides for driver
export const getRidesByDriver = async (driverId) => {
  const res = await axios.get(`${BASE_URL}/driver/${driverId}`);
  return res.data;
};

// 👀 Get rides for customer
export const getRidesByCustomer = async (customerId) => {
  const res = await axios.get(`${BASE_URL}/customer/${customerId}`);
  return res.data;
};

// 🔄 Update ride status (e.g., accepted, completed)
export const updateRideStatus = async (rideId, data) => {
  const res = await axios.patch(`${BASE_URL}/${rideId}/status`, data);
  return res.data;
};

// 🔄 Update ride details (e.g., dropoff location, dateTime)
export const updateRide = async (rideId, data) => {
  const res = await axios.patch(`${BASE_URL}/${rideId}`, data);
  return res.data;
};
