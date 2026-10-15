import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  status: 'checking', //authenticated - not-authenticated - checking
  user: {},
  errorMessage: undefined,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    checking: (state) => {
      return Object.assign(state, initialState);
    },

    login: (state, { payload }) => {
      state.status = 'authenticated';
      state.user = payload;
      state.errorMessage = undefined;
    },

    logout: (state, { payload }) => {
      state.status = 'not-authenticated';
      state.user = {};
      state.errorMessage = payload;
    },
    
    clearErrorMessage: (state) => {
      state.errorMessage = undefined;
    },
  },
});

export const { checking, login, logout, clearErrorMessage } = authSlice.actions;
