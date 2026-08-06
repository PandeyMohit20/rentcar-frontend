import { createSlice } from '@reduxjs/toolkit'

/**
 * Dashboard slice — NOT persisted.
 * Holds dashboard overview widgets and quick actions.
 */
const initialState = {
  overview: null,
  widgets: {},
  isLoading: false,
  error: null,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setOverview: (state, action) => {
      state.overview = action.payload
    },
    setWidgets: (state, action) => {
      state.widgets = action.payload
    },
    dashboardStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    dashboardSuccess: (state) => {
      state.isLoading = false
      state.error = null
    },
    dashboardFailure: (state, action) => {
      state.isLoading = false
      state.error = action.payload
    },
  },
})

export const { setOverview, setWidgets, dashboardStart, dashboardSuccess, dashboardFailure } =
  dashboardSlice.actions

export default dashboardSlice.reducer
