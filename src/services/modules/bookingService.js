import httpClient from '@/services/api/httpClient'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'

/**
 * Booking-related API service.
 */
export const bookingService = {
  async listMyBookings(params) {
    const response = await httpClient.get(API_ENDPOINTS.BOOKINGS.MINE, { params })
    return {
      bookings: Array.isArray(response?.data) ? response.data : [],
      meta: response?.meta ?? { page: 1, limit: params?.limit ?? 10, total: 0, totalPages: 0 },
    }
  },

  async getBookingDetails(id) {
    return (await httpClient.get(API_ENDPOINTS.BOOKINGS.DETAILS(id)))?.data
  },

  async createBooking({ quoteToken, idempotencyKey }) {
    const response = await httpClient.post(
      API_ENDPOINTS.BOOKINGS.CREATE,
      { quoteToken },
      { headers: { 'Idempotency-Key': idempotencyKey } }
    )
    return response?.data
  },

  async getBookingById(id) {
    return (await httpClient.get(API_ENDPOINTS.BOOKINGS.DETAILS(id)))?.data
  },

  async cancelBooking({ bookingId, reason, idempotencyKey }) {
    const response = await httpClient.post(
      API_ENDPOINTS.BOOKINGS.CANCEL(bookingId),
      reason ? { reason } : {},
      { headers: { 'Idempotency-Key': idempotencyKey } }
    )
    return response?.data
  },
}

export default bookingService
