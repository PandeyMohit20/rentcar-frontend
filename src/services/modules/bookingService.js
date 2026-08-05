import httpClient from '@/services/api/httpClient'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'

/**
 * Booking-related API service.
 */
export const bookingService = {
  async listBookings(params) {
    return httpClient.get(API_ENDPOINTS.BOOKINGS.LIST, { params })
  },

  async getBookingDetails(id) {
    return httpClient.get(API_ENDPOINTS.BOOKINGS.DETAILS(id))
  },

  async createBooking(payload) {
    return httpClient.post(API_ENDPOINTS.BOOKINGS.CREATE, payload)
  },

  async updateBooking(id, payload) {
    return httpClient.put(API_ENDPOINTS.BOOKINGS.UPDATE(id), payload)
  },

  async cancelBooking(id) {
    return httpClient.post(API_ENDPOINTS.BOOKINGS.CANCEL(id))
  },

  async rescheduleBooking(id, payload) {
    return httpClient.post(API_ENDPOINTS.BOOKINGS.RESCHEDULE(id), payload)
  },

  async getBookingHistory(params) {
    return httpClient.get(API_ENDPOINTS.BOOKINGS.HISTORY, { params })
  },

  async getInvoice(id) {
    return httpClient.get(API_ENDPOINTS.BOOKINGS.INVOICE(id))
  },
}

export default bookingService
