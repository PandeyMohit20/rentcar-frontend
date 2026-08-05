import httpClient from '@/services/api/httpClient'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'

/**
 * Authentication API service.
 * All methods return the raw response body from the backend.
 */
export const authService = {
  async login(payload) {
    return httpClient.post(API_ENDPOINTS.AUTH.LOGIN, payload)
  },

  async register(payload) {
    return httpClient.post(API_ENDPOINTS.AUTH.REGISTER, payload)
  },

  async logout() {
    return httpClient.post(API_ENDPOINTS.AUTH.LOGOUT)
  },

  async refreshToken(refreshToken) {
    return httpClient.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken })
  },

  async forgotPassword(email) {
    return httpClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email })
  },

  async resetPassword(payload) {
    return httpClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, payload)
  },

  async verifyEmail(token) {
    return httpClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token })
  },
}

export default authService
