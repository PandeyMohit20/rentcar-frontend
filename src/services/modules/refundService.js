import httpClient from '@/services/api/httpClient'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'

export const refundService = {
  async listForBooking(bookingId) {
    const response = await httpClient.get(API_ENDPOINTS.BOOKINGS.REFUNDS(bookingId))
    return Array.isArray(response?.data) ? response.data : []
  },

  async getById(refundId) {
    return (await httpClient.get(API_ENDPOINTS.REFUNDS.DETAILS(refundId)))?.data
  },
}

export default refundService
