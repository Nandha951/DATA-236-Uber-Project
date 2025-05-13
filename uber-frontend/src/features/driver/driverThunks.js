import { createAsyncThunk } from '@reduxjs/toolkit';
import * as driverAPI from '../../api/driverAPI';

export const fetchDrivers = createAsyncThunk(
  'driver/fetchDrivers',
  async () => await driverAPI.getAllDrivers()
);

export const fetchDriverById = createAsyncThunk(
  'driver/fetchDriverById',
  async (id) => await driverAPI.getDriverById(id)
);

export const addDriver = createAsyncThunk(
  'driver/addDriver',
  async (data) => await driverAPI.createDriver(data)
);

export const updateDriver = createAsyncThunk(
  'driver/updateDriver',
  async ({ id, data }) => await driverAPI.updateDriver(id, data)
);

export const deleteDriver = createAsyncThunk(
  'driver/deleteDriver',
  async (id) => {
    await driverAPI.deleteDriver(id);
    return { id };
  }
);

export const signupDriver = createAsyncThunk(
  'driver/signupDriver',
  async (driverData) => await driverAPI.signupDriver(driverData)
);

// 🔐 Login
export const loginDriver = createAsyncThunk(
  'driver/loginDriver',
  async (credentials) => await driverAPI.loginDriver(credentials)
);

// 📊 Get summary
export const getDriverSummary = createAsyncThunk(
  'driver/getSummary',
  async (driverId) => await driverAPI.getDriverSummary(driverId)
);

// 🎥 Upload video
export const uploadDriverVideo = createAsyncThunk(
  'driver/uploadVideo',
  async ({ id, videoUrl }) => await driverAPI.uploadDriverVideo(id, videoUrl)
);

// 🎥 Get videos
export const getDriverVideos = createAsyncThunk(
  'driver/getVideos',
  async (id) => await driverAPI.getDriverVideos(id)
);

