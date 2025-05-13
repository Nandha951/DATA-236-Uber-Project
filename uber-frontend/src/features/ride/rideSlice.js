// src/features/ride/rideSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
  fetchRidesByDriver,
  fetchRidesByCustomer,
  bookRide,
  updateRide
} from './rideThunks';

const initialState = {
  driverRides: [],
  customerRides: [],
  loading: false,
  error: null
};

const rideSlice = createSlice({
  name: 'ride',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRidesByDriver.fulfilled, (state, action) => {
        state.driverRides = action.payload;
      })
      .addCase(fetchRidesByCustomer.fulfilled, (state, action) => {
        state.customerRides = action.payload;
      })
      .addCase(bookRide.fulfilled, (state, action) => {
        state.customerRides.push(action.payload);
      })
      .addCase(updateRide.fulfilled, (state, action) => {
        const index = state.driverRides.findIndex(r => r._id === action.payload._id);
        if (index !== -1) state.driverRides[index] = action.payload;
      });
  }
});

export default rideSlice.reducer;
