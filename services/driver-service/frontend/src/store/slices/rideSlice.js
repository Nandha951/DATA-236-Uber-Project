import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance with auth header
const axiosInstance = axios.create({
    baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const fetchRideHistory = createAsyncThunk(
    'ride/fetchHistory',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/drivers/rides');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch ride history');
        }
    }
);

export const fetchRideDetails = createAsyncThunk(
    'ride/fetchDetails',
    async (rideId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/drivers/rides/${rideId}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch ride details');
        }
    }
);

export const acceptRide = createAsyncThunk(
    'ride/accept',
    async (rideId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/drivers/rides/${rideId}/accept`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to accept ride');
        }
    }
);

export const completeRide = createAsyncThunk(
    'ride/complete',
    async (rideId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/drivers/rides/${rideId}/complete`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to complete ride');
        }
    }
);

const initialState = {
    rides: [],
    currentRide: null,
    loading: false,
    error: null,
};

const rideSlice = createSlice({
    name: 'ride',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentRide: (state) => {
            state.currentRide = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Ride History
            .addCase(fetchRideHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRideHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.rides = action.payload;
            })
            .addCase(fetchRideHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Ride Details
            .addCase(fetchRideDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRideDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.currentRide = action.payload;
            })
            .addCase(fetchRideDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Accept Ride
            .addCase(acceptRide.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(acceptRide.fulfilled, (state, action) => {
                state.loading = false;
                state.currentRide = action.payload.ride;
                // Update the ride in history if it exists
                const index = state.rides.findIndex(ride => ride._id === action.payload.ride._id);
                if (index !== -1) {
                    state.rides[index] = action.payload.ride;
                }
            })
            .addCase(acceptRide.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Complete Ride
            .addCase(completeRide.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(completeRide.fulfilled, (state, action) => {
                state.loading = false;
                state.currentRide = action.payload.ride;
                // Update the ride in history if it exists
                const index = state.rides.findIndex(ride => ride._id === action.payload.ride._id);
                if (index !== -1) {
                    state.rides[index] = action.payload.ride;
                }
            })
            .addCase(completeRide.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearCurrentRide } = rideSlice.actions;
export default rideSlice.reducer; 