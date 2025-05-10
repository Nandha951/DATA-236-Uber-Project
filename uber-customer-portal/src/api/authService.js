import axios from 'axios';

const API_URL = 'http://localhost:3012/api/customers';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('customerId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    const { token, customer } = response.data;
    // Store token and user info
    localStorage.setItem('token', token);
    localStorage.setItem('userInfo', JSON.stringify(customer));
    localStorage.setItem('customerId', customer.id || customer._id);
    return { customer, token };
  } catch (error) {
    throw error.response?.data || { error: 'Login failed' };
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    const { token, customer } = response.data;
    // Store token and user info
    localStorage.setItem('token', token);
    localStorage.setItem('userInfo', JSON.stringify(customer));
    localStorage.setItem('customerId', customer.id || customer._id);
    return { customer, token };
  } catch (error) {
    throw error.response?.data || { error: 'Registration failed' };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userInfo');
  localStorage.removeItem('customerId');
};

export default api; 