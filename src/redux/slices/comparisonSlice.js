import { createSlice } from '@reduxjs/toolkit'

/**
 * Comparison slice — persisted.
 * Stores car IDs selected for side-by-side comparison (max 3).
 */
const MAX_COMPARE = 3

const initialState = {
  carIds: [],
}

const comparisonSlice = createSlice({
  name: 'comparison',
  initialState,
  reducers: {
    addToComparison: (state, action) => {
      const carId = action.payload
      if (state.carIds.includes(carId)) return
      if (state.carIds.length >= MAX_COMPARE) {
        // Replace the oldest selection once the limit is reached.
        state.carIds = [...state.carIds.slice(1), carId]
        return
      }
      state.carIds.push(carId)
    },
    removeFromComparison: (state, action) => {
      state.carIds = state.carIds.filter((id) => id !== action.payload)
    },
    clearComparison: (state) => {
      state.carIds = []
    },
  },
})

export const { addToComparison, removeFromComparison, clearComparison } = comparisonSlice.actions

export const comparisonLimit = MAX_COMPARE

export default comparisonSlice.reducer
