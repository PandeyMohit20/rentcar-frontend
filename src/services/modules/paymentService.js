import httpClient from '@/services/api/httpClient'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'

/**
 * Payment-related API service.
 */
export const paymentService = {
  async createPayment(payload) {
    return httpClient.post(API_ENDPOINTS.PAYMENTS.CREATE, payload)
  },

  async verifyPayment(payload) {
    return httpClient.post(API_ENDPOINTS.PAYMENTS.VERIFY, payload)
  },

  async getPaymentMethods() {
    return httpClient.get(API_ENDPOINTS.PAYMENTS.METHODS)
  },

  async refundPayment(id, payload) {
    return httpClient.post(API_ENDPOINTS.PAYMENTS.REFUND(id), payload)
  },
}

export default paymentService
