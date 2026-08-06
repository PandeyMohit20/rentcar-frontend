import { createSlice } from '@reduxjs/toolkit'

/**
 * Profile slice — NOT persisted.
 * Holds profile details, emergency contact and completion state.
 */
const initialState = {
  profile: null,
  emergencyContact: null,
  completion: { percentage: 0, missing: [] },
  isLoading: false,
  error: null,
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload
    },
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload }
    },
    setEmergencyContact: (state, action) => {
      state.emergencyContact = action.payload
    },
    setCompletion: (state, action) => {
      state.completion = action.payload
    },
    profileStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    profileSuccess: (state) => {
      state.isLoading = false
      state.error = null
    },
    profileFailure: (state, action) => {
      state.isLoading = false
      state.error = action.payload
    },
  },
})

export const {
  setProfile,
  updateProfile,
  setEmergencyContact,
  setCompletion,
  profileStart,
  profileSuccess,
  profileFailure,
} = profileSlice.actions

export default profileSlice.reducer
