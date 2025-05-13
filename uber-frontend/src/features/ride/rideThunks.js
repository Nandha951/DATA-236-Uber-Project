// src/features/ride/rideThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import * as rideAPI from '../../api/rideAPI';

export const fetchRidesByDriver = createAsyncThunk(
  'ride/fetchByDriver',
  async (driverId) => await rideAPI.getRidesByDriver(driverId)
);

export const fetchRidesByCustomer = createAsyncThunk(
  'ride/fetchByCustomer',
  async (customerId) => await rideAPI.getRidesByCustomer(customerId)
);

export const bookRide = createAsyncThunk(
  'ride/book',
  async (rideData) => await rideAPI.createRide(rideData)
);

export const updateRide = createAsyncThunk(
  'ride/updateRide',
  async ({ rideId, data }) => {
    return await rideAPI.updateRide(rideId, data);  // For updating ride details
  }
);

export const updateRideStatus = createAsyncThunk(
  'ride/updateRideStatus',
  async ({ rideId, data }) => {
    return await rideAPI.updateRideStatus(rideId, data);  // For updating ride status
  }
);

