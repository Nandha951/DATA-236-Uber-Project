import axios from 'axios';

const BASE_URL = 'http://localhost:4003/api/customers'; // update port if different

// 🔐 Signup
export const signupCustomer = async (data) => {
  const res = await axios.post(`${BASE_URL}/signup`, data);
  return res.data;
};

// 🔐 Login
export const loginCustomer = async (credentials) => {
  const res = await axios.post(`${BASE_URL}/login`, credentials);
  return res.data;
};

// 👤 Get profile by ID
export const getCustomerById = async (id) => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

export const getAllCustomers = async () => {
  const response = await axios.get("http://localhost:4003/api/customers");
  return response.data;
};

export const updateCustomer = async (id, data) => {
  const res = await axios.put(`${BASE_URL}/${id}`, data);
  return res.data;
};