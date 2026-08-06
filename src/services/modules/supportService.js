import httpClient from '@/services/api/httpClient'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'

/**
 * Support / contact API service.
 */
export const supportService = {
  async getSupportContent() {
    return httpClient.get(API_ENDPOINTS.CONTENT.SUPPORT)
  },

  async submitInquiry(payload) {
    // Support inquiries are submitted via the contact endpoint.
    return httpClient.post(API_ENDPOINTS.CONTENT.SUPPORT, payload)
  },

  async getTickets() {
    return Promise.resolve({ data: { tickets: [] } })
  },

  async getTicketDetails(id) {
    return Promise.resolve({ data: { id, messages: [], status: 'open' } })
  },

  async createTicket(payload) {
    return Promise.resolve({ data: { id: `TKT-${Date.now()}`, ...payload, status: 'open' } })
  },

  async replyToTicket(id, payload) {
    return Promise.resolve({ data: { id, ...payload } })
  },

  async getFaqs() {
    return Promise.resolve({ data: { faqs: [] } })
  },
}

export default supportService
