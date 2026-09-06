import httpClient from '@/services/api/httpClient'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { normalizeCar } from './carService'

export const availabilityService = {
  async searchAvailability(payload) {
    const response = await httpClient.post(API_ENDPOINTS.AVAILABILITY.SEARCH, payload)
    return {
      cars: (Array.isArray(response?.data) ? response.data : []).map(normalizeCar),
      meta: response?.meta || null,
    }
  },
}
export default availabilityService
