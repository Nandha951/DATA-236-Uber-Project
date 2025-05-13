// src/features/billing/billingThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import * as billingAPI from '../../api/billingAPI';

export const fetchBillingByDriver = createAsyncThunk(
  'billing/fetchByDriver',
  async (driverId) => await billingAPI.getBillingByDriver(driverId)
);

export const fetchBillingByCustomer = createAsyncThunk(
  'billing/fetchByCustomer',
  async (customerId) => await billingAPI.getBillingByCustomer(customerId)
);
