import { createSlice } from '@reduxjs/toolkit'

/**
 * Authentication slice — persisted.
 * Holds user identity and authentication status.
 */
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    loginSuccess: (state, action) => {
      state.isLoading = false
      state.isAuthenticated = true
      state.user = action.payload.user
      state.token = action.payload.token
      state.error = null
    },
    loginFailure: (state, action) => {
      state.isLoading = false
      state.isAuthenticated = false
      state.error = action.payload
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.isLoading = false
      state.error = null
    },
    updateUser: (state, action) => {
      state.user = action.payload
    },
    setToken: (state, action) => {
      state.token = action.payload
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, updateUser, setToken } =
  authSlice.actions

export default authSlice.reducer
