import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import billingReducer from '../features/billing/billingSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    billing: billingReducer,
  },
});
