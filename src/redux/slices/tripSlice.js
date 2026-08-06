import { createSlice } from '@reduxjs/toolkit'

/**
 * Trip slice — NOT persisted.
 * Tracks trip summary data (car, pickup/drop, duration, distance/fuel placeholders, cost).
 */
const initialState = {
  trip: null,
  isLoading: false,
  error: null,
}

const tripSlice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    setTrip: (state, action) => {
      state.trip = action.payload
    },
    tripStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    tripSuccess: (state) => {
      state.isLoading = false
      state.error = null
    },
    tripFailure: (state, action) => {
      state.isLoading = false
      state.error = action.payload
    },
    resetTrip: () => initialState,
  },
})

export const { setTrip, tripStart, tripSuccess, tripFailure, resetTrip } = tripSlice.actions

export default tripSlice.reducer
