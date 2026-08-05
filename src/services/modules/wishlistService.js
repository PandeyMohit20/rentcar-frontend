import httpClient from '@/services/api/httpClient'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'

/**
 * Wishlist-related API service.
 */
export const wishlistService = {
  async listWishlist() {
    return httpClient.get(API_ENDPOINTS.WISHLIST.LIST)
  },

  async addToWishlist(carId) {
    return httpClient.post(API_ENDPOINTS.WISHLIST.ADD, { carId })
  },

  async removeFromWishlist(carId) {
    return httpClient.delete(API_ENDPOINTS.WISHLIST.REMOVE(carId))
  },

  async checkWishlist(carId) {
    return httpClient.get(API_ENDPOINTS.WISHLIST.CHECK(carId))
  },
}

export default wishlistService
