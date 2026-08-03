import { createSlice } from '@reduxjs/toolkit'

/**
 * Booking slice — NOT persisted.
 * Holds the in-progress booking draft and checkout state.
 */
const initialState = {
  draftBooking: null,
  currentBooking: null,
  selectedPaymentMethod: null,
  couponCode: null,
  isLoading: false,
  error: null,
}

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setDraftBooking: (state, action) => {
      state.draftBooking = action.payload
    },
    clearDraftBooking: (state) => {
      state.draftBooking = null
    },
    setCurrentBooking: (state, action) => {
      state.currentBooking = action.payload
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null
    },
    setPaymentMethod: (state, action) => {
      state.selectedPaymentMethod = action.payload
    },
    setCouponCode: (state, action) => {
      state.couponCode = action.payload
    },
    clearCouponCode: (state) => {
      state.couponCode = null
    },
    bookingStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    bookingSuccess: (state) => {
      state.isLoading = false
      state.error = null
    },
    bookingFailure: (state, action) => {
      state.isLoading = false
      state.error = action.payload
    },
  },
})

export const {
  setDraftBooking,
  clearDraftBooking,
  setCurrentBooking,
  clearCurrentBooking,
  setPaymentMethod,
  setCouponCode,
  clearCouponCode,
  bookingStart,
  bookingSuccess,
  bookingFailure,
} = bookingSlice.actions

export default bookingSlice.reducer
