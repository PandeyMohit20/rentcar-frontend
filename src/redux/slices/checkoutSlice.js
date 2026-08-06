import { createSlice } from '@reduxjs/toolkit'

/**
 * Checkout slice — NOT persisted.
 * Tracks billing details, insurance selection, add-ons, price breakdown and terms acceptance.
 */
const initialState = {
  billing: null,
  insurance: null,
  addons: [],
  priceBreakdown: null,
  termsAccepted: false,
  privacyAccepted: false,
  cancellationAccepted: false,
  isLoading: false,
  error: null,
}

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setBilling: (state, action) => {
      state.billing = action.payload
    },
    setInsurance: (state, action) => {
      state.insurance = action.payload
    },
    setAddons: (state, action) => {
      state.addons = action.payload
    },
    setPriceBreakdown: (state, action) => {
      state.priceBreakdown = action.payload
    },
    setTermsAccepted: (state, action) => {
      state.termsAccepted = action.payload
    },
    setPrivacyAccepted: (state, action) => {
      state.privacyAccepted = action.payload
    },
    setCancellationAccepted: (state, action) => {
      state.cancellationAccepted = action.payload
    },
    checkoutStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    checkoutSuccess: (state) => {
      state.isLoading = false
      state.error = null
    },
    checkoutFailure: (state, action) => {
      state.isLoading = false
      state.error = action.payload
    },
    resetCheckout: () => initialState,
  },
})

export const {
  setBilling,
  setInsurance,
  setAddons,
  setPriceBreakdown,
  setTermsAccepted,
  setPrivacyAccepted,
  setCancellationAccepted,
  checkoutStart,
  checkoutSuccess,
  checkoutFailure,
  resetCheckout,
} = checkoutSlice.actions

export default checkoutSlice.reducer
