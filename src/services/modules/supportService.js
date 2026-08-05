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
}

export default supportService
