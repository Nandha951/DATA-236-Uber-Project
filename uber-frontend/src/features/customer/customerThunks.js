// src/features/customer/customerThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import * as customerAPI from '../../api/customerAPI';

export const signupCustomer = createAsyncThunk(
  'customer/signup',
  async (data) => await customerAPI.signupCustomer(data)
);

export const loginCustomer = createAsyncThunk(
  'customer/login',
  async (credentials) => await customerAPI.loginCustomer(credentials)
);

export const fetchCustomerById = createAsyncThunk(
  'customer/fetchById',
  async (id) => await customerAPI.getCustomerById(id)
);

export const updateCustomer = createAsyncThunk(
  'customer/update',
  async ({ id, data }) => await customerAPI.updateCustomer(id, data)
);