import { createSlice } from '@reduxjs/toolkit'

/**
 * Authentication slice — persisted.
 * Holds user identity and authentication status.
 */
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isRestoring: true,
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
      state.isRestoring = false
      state.isAuthenticated = true
      state.user = action.payload.user
      state.error = null
    },
    loginFailure: (state, action) => {
      state.isLoading = false
      state.isAuthenticated = false
      state.error = action.payload
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.isLoading = false
      state.error = null
      state.isRestoring = false
    },
    updateUser: (state, action) => {
      state.user = action.payload
    },
    restoreStart: (state) => {
      state.isRestoring = true
      state.isAuthenticated = false
      state.user = null
    },
    restoreSuccess: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.isRestoring = false
    },
    restoreFailure: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.isRestoring = false
    },
  },
})

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  restoreStart,
  restoreSuccess,
  restoreFailure,
} = authSlice.actions

export default authSlice.reducer
