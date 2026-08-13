import httpClient from '@/services/api/httpClient'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'

/**
 * Authentication API service.
 *
 * All methods return the raw response body from the backend.
 */
export const authService = {
  /**
   * Login user.
   */
  async login(payload) {
    return httpClient.post(API_ENDPOINTS.AUTH.LOGIN, payload)
  },

  /**
   * Register new user.
   */
  async register(payload) {
    return httpClient.post(API_ENDPOINTS.AUTH.REGISTER, payload)
  },

  /**
   * Logout current session.
   */
  async logout() {
    return httpClient.post(API_ENDPOINTS.AUTH.LOGOUT)
  },

  /**
   * Refresh access token.
   */
  async refreshToken(refreshToken) {
    return httpClient.post(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken,
    })
  },

  /**
   * Request password reset.
   */
  async forgotPassword(email) {
    return httpClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      email,
    })
  },

  /**
   * Reset password.
   */
  async resetPassword(payload) {
    return httpClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, payload)
  },

  /**
   * Legacy token-based email verification.
   */
  async verifyEmail(token) {
    return httpClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
      token,
    })
  },

  /**
   * Send OTP.
   *
   * Example:
   * {
   *   email: 'user@example.com',
   *   purpose: 'EMAIL_VERIFICATION'
   * }
   */
  async sendOtp(payload) {
    return httpClient.post(API_ENDPOINTS.AUTH.SEND_OTP, payload)
  },

  /**
   * Verify OTP.
   *
   * Example:
   * {
   *   email: 'user@example.com',
   *   purpose: 'EMAIL_VERIFICATION',
   *   otp: '123456'
   * }
   */
  async verifyOtp(payload) {
    return httpClient.post(API_ENDPOINTS.AUTH.VERIFY_OTP, payload)
  },

  /**
   * Resend email verification OTP.
   */
  async resendVerification(email) {
    return httpClient.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, {
      email,
    })
  },
}

export default authService
