import { createSlice } from '@reduxjs/toolkit'

/**
 * Notification slice — NOT persisted.
 * Tracks unread notification count and in-app toast queue.
 */
const initialState = {
  unreadCount: 0,
  notifications: [],
  isLoading: false,
  error: null,
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1
    },
    decrementUnreadCount: (state) => {
      state.unreadCount = Math.max(0, state.unreadCount - 1)
    },
    resetUnreadCount: (state) => {
      state.unreadCount = 0
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload
    },
    markAllRead: (state) => {
      state.unreadCount = 0
      state.notifications = state.notifications.map((n) => ({ ...n, isRead: true }))
    },
    notificationStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    notificationSuccess: (state) => {
      state.isLoading = false
      state.error = null
    },
    notificationFailure: (state, action) => {
      state.isLoading = false
      state.error = action.payload
    },
  },
})

export const {
  setUnreadCount,
  incrementUnreadCount,
  decrementUnreadCount,
  resetUnreadCount,
  setNotifications,
  markAllRead,
  notificationStart,
  notificationSuccess,
  notificationFailure,
} = notificationSlice.actions

export default notificationSlice.reducer
