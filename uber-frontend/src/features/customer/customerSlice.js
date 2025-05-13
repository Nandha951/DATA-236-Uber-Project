// src/features/customer/customerSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { signupCustomer, loginCustomer, fetchCustomerById } from './customerThunks';

const initialState = {
  authCustomer: null,
  profile: null,
  loading: false,
  error: null
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    logoutCustomer: (state) => {
      state.authCustomer = null;
      localStorage.removeItem('authCustomer');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupCustomer.fulfilled, (state, action) => {
        state.authCustomer = action.payload.customer;
        localStorage.setItem('authCustomer', JSON.stringify(action.payload.customer));
      })
      .addCase(loginCustomer.fulfilled, (state, action) => {
        state.authCustomer = action.payload.customer;
        localStorage.setItem('authCustomer', JSON.stringify(action.payload.customer));
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.profile = action.payload;
      });
  }
});

export const { logoutCustomer } = customerSlice.actions;
export default customerSlice.reducer;
