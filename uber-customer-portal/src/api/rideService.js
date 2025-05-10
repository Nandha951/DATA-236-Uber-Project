import axios from 'axios';

const BASE_URL = 'http://localhost:3016/api/rides';

export const createRide = (rideData) =>
  axios.post(BASE_URL, rideData);

export const getNearbyDrivers = (lat, lng) =>
  axios.get(`${BASE_URL}/nearby-drivers?lat=${lat}&lng=${lng}`);

export const getRidesByCustomer = (customerId) =>
  axios.get(`http://localhost:3016/api/rides/customer/${customerId}`);
  
