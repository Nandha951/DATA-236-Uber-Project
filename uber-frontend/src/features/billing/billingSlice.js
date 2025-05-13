// src/features/billing/billingSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchBillingByDriver, fetchBillingByCustomer } from './billingThunks';

const initialState = {
  driverBills: [],
  customerBills: [],
  loading: false,
  error: null
};

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBillingByDriver.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBillingByDriver.fulfilled, (state, action) => {
        state.loading = false;
        state.driverBills = action.payload;
      })
      .addCase(fetchBillingByDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchBillingByCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBillingByCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customerBills = action.payload;
      })
      .addCase(fetchBillingByCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default billingSlice.reducer;
