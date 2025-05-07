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

export const updateLocation = createAsyncThunk(
    'driver/updateLocation',
    async (locationData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put('/drivers/location', locationData);
            return response.data.data.location;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update location');
        }
    }
);

export const updateStatus = createAsyncThunk(
    'driver/updateStatus',
    async (status, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put('/drivers/status', { status });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update status');
        }
    }
);

export const updateProfile = createAsyncThunk(
    'driver/updateProfile',
    async (profileData, { rejectWithValue }) => {
        try {
            console.log('Sending profile update request');
            const response = await axiosInstance.put('/drivers/profile', profileData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Profile update response:', {
                status: response.status,
                hasData: !!response.data,
                hasProfileImage: !!(response.data?.data?.profileImage && response.data?.data?.profileImage.fileId)
            });
            return response.data.data;
        } catch (error) {
            console.error('Profile update error:', error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
        }
    }
);

export const fetchProfile = createAsyncThunk(
    'driver/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            console.log('Fetching profile data');
            const response = await axiosInstance.get('/drivers/profile');
            console.log('Profile fetch response:', {
                status: response.status,
                hasData: !!response.data,
                hasProfileImage: !!(response.data?.data?.profileImage && response.data?.data?.profileImage.fileId)
            });
            return response.data.data;
        } catch (error) {
            console.error('Profile fetch error:', error.response?.data || error.message);
            const errorMessage = error.response?.data?.message || 'Failed to fetch profile';
            return rejectWithValue(errorMessage);
        }
    }
);

export const fetchRides = createAsyncThunk(
    'driver/fetchRides',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/drivers/rides');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch rides');
        }
    }
);

const initialState = {
    user: null,
    status: 'offline',
    location: null,
    loading: false,
    error: null,
    rides: [],
    ridesLoading: false,
    ridesError: null
};

const driverSlice = createSlice({
    name: 'driver',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Update Location
            .addCase(updateLocation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateLocation.fulfilled, (state, action) => {
                state.loading = false;
                state.location = action.payload;
            })
            .addCase(updateLocation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Status
            .addCase(updateStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.status = action.payload.status;
            })
            .addCase(updateStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Profile
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Profile
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Rides
            .addCase(fetchRides.pending, (state) => {
                state.ridesLoading = true;
                state.ridesError = null;
            })
            .addCase(fetchRides.fulfilled, (state, action) => {
                state.ridesLoading = false;
                state.rides = action.payload;
            })
            .addCase(fetchRides.rejected, (state, action) => {
                state.ridesLoading = false;
                state.ridesError = action.payload;
            });
    },
});

export const { clearError } = driverSlice.actions;
export default driverSlice.reducer; 