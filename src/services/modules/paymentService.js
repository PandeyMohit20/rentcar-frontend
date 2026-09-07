import httpClient from '@/services/api/httpClient'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'

/**
 * Payment-related API service.
 */
export const paymentService = {
  async createOrder(bookingId) {
    return (await httpClient.post(API_ENDPOINTS.PAYMENTS.ORDERS, { bookingId }))?.data
  },

  async getPaymentById(paymentId) {
    return (await httpClient.get(API_ENDPOINTS.PAYMENTS.DETAILS(paymentId)))?.data
  },

  async verifyPayment(payload) {
    return (await httpClient.post(API_ENDPOINTS.PAYMENTS.VERIFY, payload))?.data
  },
}

export default paymentService
