import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/drivers/login`, credentials);
            const { token, driver } = response.data.data;

            // Store token
            localStorage.setItem('token', token);

            // Ensure we have the complete driver data including profile image
            const driverData = {
                ...driver,
                profileImageData: driver.profileImageData || null
            };

            // Store driver data in localStorage for persistence
            localStorage.setItem('driverData', JSON.stringify(driverData));

            return { token, driver: driverData };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/drivers/register`, userData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

// Get initial state from localStorage
const getInitialState = () => {
    const token = localStorage.getItem('token');
    const driverData = localStorage.getItem('driverData');

    let parsedDriverData = null;
    if (driverData) {
        try {
            parsedDriverData = JSON.parse(driverData);
            // Ensure profileImageData is preserved
            if (!parsedDriverData.profileImageData) {
                parsedDriverData.profileImageData = null;
            }
        } catch (error) {
            console.error('Error parsing driver data from localStorage:', error);
        }
    }

    return {
        user: parsedDriverData,
        token,
        isAuthenticated: !!token,
        loading: false,
        error: null,
    };
};

const authSlice = createSlice({
    name: 'auth',
    initialState: getInitialState(),
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            localStorage.removeItem('driverData');
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        },
        clearError: (state) => {
            state.error = null;
        },
        updateUserData: (state, action) => {
            // Ensure we're storing the complete user data including profile image
            const updatedUser = {
                ...state.user,
                ...action.payload,
                profileImageData: action.payload.profileImageData || state.user?.profileImageData
            };

            // Update state
            state.user = updatedUser;

            // Update localStorage
            try {
                localStorage.setItem('driverData', JSON.stringify(updatedUser));
            } catch (error) {
                console.error('Error storing driver data in localStorage:', error);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.driver;
                state.token = action.payload.token;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, clearError, updateUserData } = authSlice.actions;
export default authSlice.reducer; 