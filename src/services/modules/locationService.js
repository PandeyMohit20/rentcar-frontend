import httpClient from '@/services/api/httpClient'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'

const unwrapList = (response) => ({
  items: Array.isArray(response?.data) ? response.data : [],
  meta: response?.meta || null,
})

export const locationService = {
  async getCities(params = { limit: 100 }) {
    return unwrapList(await httpClient.get(API_ENDPOINTS.LOCATIONS.CITIES, { params }))
  },
  async getBranches(params = { limit: 100 }) {
    return unwrapList(await httpClient.get(API_ENDPOINTS.LOCATIONS.BRANCHES, { params }))
  },
  async getLocations(params = { limit: 100 }) {
    return unwrapList(await httpClient.get(API_ENDPOINTS.LOCATIONS.LIST, { params }))
  },
}
export default locationService
