import { createSlice } from '@reduxjs/toolkit';
import {
  fetchDrivers,
  addDriver,
  updateDriver,
  deleteDriver,
  fetchDriverById,
  signupDriver,
  loginDriver,
  getDriverSummary,
  getDriverVideos,
  uploadDriverVideo
} from './driverThunks';

const savedDriver = localStorage.getItem('authDriver');
const initialState = {
  drivers: [],
  selectedDriver: null,
  summary: null,
  videos: [],
  authDriver: savedDriver ? JSON.parse(savedDriver) : null,
  loading: false,
  error: null
};

const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {
    clearSelectedDriver: (state) => {
      state.selectedDriver = null;
    },
    logoutDriver: (state) => {
      state.authDriver = null;
      localStorage.removeItem('authDriver');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDrivers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDrivers.fulfilled, (state, action) => {
        state.loading = false;
        state.drivers = action.payload;
      })
      .addCase(fetchDrivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(addDriver.fulfilled, (state, action) => {
        state.drivers.push(action.payload);
      })

      .addCase(updateDriver.fulfilled, (state, action) => {
        const index = state.drivers.findIndex(d => d._id === action.payload._id);
        if (index !== -1) state.drivers[index] = action.payload;
        state.authDriver = action.payload;
        localStorage.setItem('authDriver', JSON.stringify(action.payload));
      })

      .addCase(deleteDriver.fulfilled, (state, action) => {
        state.drivers = state.drivers.filter(d => d._id !== action.payload.id);
      })

      .addCase(fetchDriverById.fulfilled, (state, action) => {
        state.selectedDriver = action.payload;
      })

      .addCase(signupDriver.fulfilled, (state, action) => {
        state.authDriver = action.payload.driver;
        localStorage.setItem('authDriver', JSON.stringify(action.payload.driver));
      })

      .addCase(loginDriver.fulfilled, (state, action) => {
        state.authDriver = action.payload.driver;
        localStorage.setItem('authDriver', JSON.stringify(action.payload.driver));
      })

      .addCase(getDriverSummary.fulfilled, (state, action) => {
        state.summary = action.payload.summary;
      })

      .addCase(getDriverVideos.fulfilled, (state, action) => {
        state.videos = action.payload;
      })

      .addCase(uploadDriverVideo.fulfilled, (state, action) => {
        state.videos.push(action.payload); // or re-fetch if needed
      });
  }
});

export const { clearSelectedDriver, logoutDriver } = driverSlice.actions;

export default driverSlice.reducer;
