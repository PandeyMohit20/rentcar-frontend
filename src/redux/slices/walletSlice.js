import { createSlice } from '@reduxjs/toolkit'

/**
 * Wallet slice — NOT persisted.
 * Holds wallet balance, transactions and refunds.
 */
const initialState = {
  balance: 0,
  currency: 'INR',
  transactions: [],
  refunds: [],
  isLoading: false,
  error: null,
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setBalance: (state, action) => {
      state.balance = action.payload?.balance ?? action.payload
      state.currency = action.payload?.currency ?? state.currency
    },
    setTransactions: (state, action) => {
      state.transactions = action.payload
    },
    addTransaction: (state, action) => {
      state.transactions = [action.payload, ...state.transactions]
    },
    setRefunds: (state, action) => {
      state.refunds = action.payload
    },
    walletStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    walletSuccess: (state) => {
      state.isLoading = false
      state.error = null
    },
    walletFailure: (state, action) => {
      state.isLoading = false
      state.error = action.payload
    },
  },
})

export const {
  setBalance,
  setTransactions,
  addTransaction,
  setRefunds,
  walletStart,
  walletSuccess,
  walletFailure,
} = walletSlice.actions

export default walletSlice.reducer
