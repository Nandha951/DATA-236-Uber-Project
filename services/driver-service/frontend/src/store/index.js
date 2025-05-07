import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import driverReducer from './slices/driverSlice';
import rideReducer from './slices/rideSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        driver: driverReducer,
        ride: rideReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
}); 