import { createSlice } from '@reduxjs/toolkit'

/**
 * Payment slice — NOT persisted.
 * Tracks selected method, split allocations and flow status.
 */
const initialState = {
  method: null,
  split: [],
  status: 'idle', // idle | processing | success | failed
  reference: null,
  error: null,
}

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPaymentMethod: (state, action) => {
      state.method = action.payload
    },
    setSplitPayment: (state, action) => {
      state.split = action.payload
    },
    setPaymentStatus: (state, action) => {
      state.status = action.payload
    },
    setPaymentReference: (state, action) => {
      state.reference = action.payload
    },
    paymentStart: (state) => {
      state.status = 'processing'
      state.error = null
    },
    paymentSuccess: (state, action) => {
      state.status = 'success'
      state.reference = action.payload?.reference ?? action.payload
      state.error = null
    },
    paymentFailed: (state, action) => {
      state.status = 'failed'
      state.error = action.payload
    },
    resetPayment: () => initialState,
  },
})

export const {
  setPaymentMethod,
  setSplitPayment,
  setPaymentStatus,
  setPaymentReference,
  paymentStart,
  paymentSuccess,
  paymentFailed,
  resetPayment,
} = paymentSlice.actions

export default paymentSlice.reducer
