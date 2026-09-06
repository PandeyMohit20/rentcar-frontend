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

  async createPayment(payload) {
    return httpClient.post(API_ENDPOINTS.PAYMENTS.CREATE, payload)
  },

  async verifyPayment(payload) {
    return (await httpClient.post(API_ENDPOINTS.PAYMENTS.VERIFY, payload))?.data
  },

  async getPaymentMethods() {
    return httpClient.get(API_ENDPOINTS.PAYMENTS.METHODS)
  },

  async refundPayment(id, payload) {
    return httpClient.post(API_ENDPOINTS.PAYMENTS.REFUND(id), payload)
  },
}

export default paymentService
