import axios from "axios";

const BASE_URL = "http://localhost:4005/api/admin"; // Replace with actual port

export const adminLogin = (data) => axios.post(`${BASE_URL}/login`, data);
export const adminSignup = (data) => axios.post(`${BASE_URL}/signup`, data);

export const addDriverByAdmin = async (data) => {
  console.log("🚀 API Call Payload: ", data);
  try {
    const response = await axios.post(`${BASE_URL}/drivers`, data);
    console.log("✅ API Response: ", response.data); // Log response
    return response;
  } catch (error) {
    console.error("❌ API Error Response:", error.response?.data); // Log error
    throw error;
  }
};

export const addCustomerByAdmin = (data) => axios.post(`${BASE_URL}/customers`, data);

export const reviewDriver = (driverId) => axios.get(`${BASE_URL}/drivers/${driverId}`);
export const reviewCustomer = (customerId) => axios.get(`${BASE_URL}/customers/${customerId}`);

export const getRevenueStats = () => axios.get(`${BASE_URL}/statistics/revenue`);
export const getRideStats = () => axios.get(`${BASE_URL}/statistics/rides`);

export const searchBills = (query) =>
  axios.get('http://localhost:4005/api/admin/bills/search', { params: query });
export const getBillDetails = (billId) =>
  axios.get(`http://localhost:4005/api/admin/bills/${billId}`);

