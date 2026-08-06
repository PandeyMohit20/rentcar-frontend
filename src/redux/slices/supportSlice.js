import { createSlice } from '@reduxjs/toolkit'

/**
 * Support slice — NOT persisted.
 * Holds support tickets, current ticket and FAQs.
 */
const initialState = {
  tickets: [],
  currentTicket: null,
  faqs: [],
  isLoading: false,
  error: null,
}

const supportSlice = createSlice({
  name: 'support',
  initialState,
  reducers: {
    setTickets: (state, action) => {
      state.tickets = action.payload
    },
    addTicket: (state, action) => {
      state.tickets = [action.payload, ...state.tickets]
    },
    setCurrentTicket: (state, action) => {
      state.currentTicket = action.payload
    },
    setFaqs: (state, action) => {
      state.faqs = action.payload
    },
    supportStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    supportSuccess: (state) => {
      state.isLoading = false
      state.error = null
    },
    supportFailure: (state, action) => {
      state.isLoading = false
      state.error = action.payload
    },
  },
})

export const {
  setTickets,
  addTicket,
  setCurrentTicket,
  setFaqs,
  supportStart,
  supportSuccess,
  supportFailure,
} = supportSlice.actions

export default supportSlice.reducer
