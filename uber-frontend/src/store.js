import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage
import driverReducer from './features/driver/driverSlice';
import rideReducer from './features/ride/rideSlice';
import customerReducer from './features/customer/customerSlice';
import billingReducer from './features/billing/billingSlice';
import adminReducer from './features/admin/adminSlice';

// Combine all slices
const rootReducer = combineReducers({
  driver: driverReducer,
  ride: rideReducer,
  customer: customerReducer,
  billing: billingReducer,
  admin: adminReducer,
});

// Setup persist config
const persistConfig = {
  key: 'root',
  storage,
};

// Wrap combined reducer with persistence
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with necessary middleware
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/FLUSH',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }),
});

export const persistor = persistStore(store);
export default store;