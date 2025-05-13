import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  admin: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdmin(state, action) {
      state.isLoggedIn = true;
      state.admin = action.payload;
    },
    logoutAdmin(state) {
      state.isLoggedIn = false;
      state.admin = null;
    },
  },
});

export const { setAdmin, logoutAdmin } = adminSlice.actions;
export default adminSlice.reducer;
