import { createSlice } from '@reduxjs/toolkit'

/**
 * Settings slice — NOT persisted.
 * Holds user preferences (theme, language, notification toggles).
 */
const initialState = {
  preferences: {
    theme: 'light',
    language: 'en',
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
  },
  isLoading: false,
  error: null,
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setPreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload }
    },
    updatePreference: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload }
    },
    settingsStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    settingsSuccess: (state) => {
      state.isLoading = false
      state.error = null
    },
    settingsFailure: (state, action) => {
      state.isLoading = false
      state.error = action.payload
    },
  },
})

export const { setPreferences, updatePreference, settingsStart, settingsSuccess, settingsFailure } =
  settingsSlice.actions

export default settingsSlice.reducer
