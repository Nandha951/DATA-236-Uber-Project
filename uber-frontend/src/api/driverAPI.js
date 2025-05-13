import axios from 'axios';

const BASE_URL = 'http://localhost:4002/api/drivers';

// ========================
// 📌 Auth
// ========================
export const signupDriver = async (driverData) => {
  const response = await axios.post(`${BASE_URL}/signup`, driverData);
  return response.data;
};

export const loginDriver = async (credentials) => {
  const response = await axios.post(`${BASE_URL}/login`, credentials);
  return response.data;
};

// ========================
// 📌 CRUD
// ========================
export const getAllDrivers = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const getDriverById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const createDriver = async (data) => {
  const response = await axios.post(BASE_URL, data);
  return response.data;
};

export const updateDriver = async (id, data) => {
  const response = await axios.put(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteDriver = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};

// ========================
// 🔍 Search
// ========================
export const searchDrivers = async (query) => {
  const response = await axios.get(`${BASE_URL}/search`, { params: query });
  return response.data;
};

// ========================
// 🎥 Video Upload/Preview
// ========================
export const uploadDriverVideo = async (id, videoUrl) => {
  const response = await axios.post(`${BASE_URL}/${id}/video`, { videoUrl });
  return response.data;
};

export const getDriverVideos = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}/video`);
  return response.data;
};

// ========================
// 📊 Summary
// ========================
export const getDriverSummary = async (driverId) => {
  const response = await axios.get(`${BASE_URL}/${driverId}/summary`);
  return response.data;
};
