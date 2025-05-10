import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  billingData: null,
  loading: false,
  error: null,
};

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    fetchBillingStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchBillingSuccess(state, action) {
      state.loading = false;
      state.billingData = action.payload;
    },
    fetchBillingFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearBilling(state) {
      state.billingData = null;
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  fetchBillingStart,
  fetchBillingSuccess,
  fetchBillingFailure,
  clearBilling,
} = billingSlice.actions;

export default billingSlice.reducer; 