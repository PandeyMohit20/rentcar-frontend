import { createSlice } from '@reduxjs/toolkit'

/**
 * Coupon slice — NOT persisted.
 * Tracks available coupons, applied coupon and validation placeholder state.
 */
const initialState = {
  coupons: [],
  applied: null,
  isLoading: false,
  error: null,
}

const couponSlice = createSlice({
  name: 'coupon',
  initialState,
  reducers: {
    setCoupons: (state, action) => {
      state.coupons = action.payload
    },
    applyCoupon: (state, action) => {
      state.applied = action.payload
      state.error = null
    },
    removeCoupon: (state) => {
      state.applied = null
    },
    couponStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    couponSuccess: (state) => {
      state.isLoading = false
      state.error = null
    },
    couponFailure: (state, action) => {
      state.isLoading = false
      state.error = action.payload
    },
    resetCoupon: () => initialState,
  },
})

export const {
  setCoupons,
  applyCoupon,
  removeCoupon,
  couponStart,
  couponSuccess,
  couponFailure,
  resetCoupon,
} = couponSlice.actions

export default couponSlice.reducer
