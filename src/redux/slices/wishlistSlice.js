import { createSlice } from '@reduxjs/toolkit'

/**
 * Wishlist slice — persisted.
 * Stores car IDs the user has added to their wishlist.
 */
const initialState = {
  carIds: [],
  isLoading: false,
  error: null,
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlistStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    addToWishlist: (state, action) => {
      const carId = action.payload
      if (!state.carIds.includes(carId)) {
        state.carIds.push(carId)
      }
      state.isLoading = false
      state.error = null
    },
    removeFromWishlist: (state, action) => {
      state.carIds = state.carIds.filter((id) => id !== action.payload)
      state.isLoading = false
      state.error = null
    },
    toggleWishlistFailure: (state, action) => {
      state.isLoading = false
      state.error = action.payload
    },
    clearWishlist: (state) => {
      state.carIds = []
      state.error = null
      state.isLoading = false
    },
  },
})

export const {
  toggleWishlistStart,
  addToWishlist,
  removeFromWishlist,
  toggleWishlistFailure,
  clearWishlist,
} = wishlistSlice.actions

export default wishlistSlice.reducer
