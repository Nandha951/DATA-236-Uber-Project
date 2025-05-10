import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: null,
  token: null,
  customerId: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload;
      state.customerId = action.payload.id || action.payload._id;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.userInfo = null;
      state.token = null;
      state.customerId = null;
    },
    initializeFromStorage: (state) => {
      const token = localStorage.getItem('token');
      const userInfo = localStorage.getItem('userInfo');
      const customerId = localStorage.getItem('customerId');

      if (token) state.token = token;
      if (userInfo) state.userInfo = JSON.parse(userInfo);
      if (customerId) state.customerId = customerId;
    }
  }
});

export const { setUser, setToken, logout, initializeFromStorage } = userSlice.actions;
export default userSlice.reducer;
