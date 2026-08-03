import { createSlice } from '@reduxjs/toolkit'

/**
 * UI slice — persisted (small).
 * Manages theme mode and navigation drawer state.
 */
const initialState = {
  themeMode: 'light',
  sidebarOpen: false,
  isPageLoading: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light'
    },
    setThemeMode: (state, action) => {
      state.themeMode = action.payload
    },
    openSidebar: (state) => {
      state.sidebarOpen = true
    },
    closeSidebar: (state) => {
      state.sidebarOpen = false
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setPageLoading: (state, action) => {
      state.isPageLoading = action.payload
    },
  },
})

export const {
  toggleTheme,
  setThemeMode,
  openSidebar,
  closeSidebar,
  toggleSidebar,
  setPageLoading,
} = uiSlice.actions

export default uiSlice.reducer
