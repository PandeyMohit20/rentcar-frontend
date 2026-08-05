import httpClient from '@/services/api/httpClient'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'

/**
 * Car-related API service.
 */
export const carService = {
  async listCars(params) {
    return httpClient.get(API_ENDPOINTS.CARS.LIST, { params })
  },

  async searchCars(params) {
    return httpClient.get(API_ENDPOINTS.CARS.SEARCH, { params })
  },

  async getCarDetails(id) {
    return httpClient.get(API_ENDPOINTS.CARS.DETAILS(id))
  },

  async getFeaturedCars() {
    return httpClient.get(API_ENDPOINTS.CARS.FEATURED)
  },

  async getPopularCars() {
    return httpClient.get(API_ENDPOINTS.CARS.POPULAR)
  },

  async getCarReviews(id) {
    return httpClient.get(API_ENDPOINTS.CARS.REVIEWS(id))
  },

  async getPriceEstimate(params) {
    return httpClient.get(API_ENDPOINTS.CARS.PRICE, { params })
  },
}

export default carService
