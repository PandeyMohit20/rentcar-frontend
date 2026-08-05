import httpClient from '@/services/api/httpClient'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'

/**
 * User / profile-related API service.
 */
export const userService = {
  async getProfile() {
    return httpClient.get(API_ENDPOINTS.USER.PROFILE)
  },

  async updateProfile(payload) {
    return httpClient.put(API_ENDPOINTS.USER.UPDATE_PROFILE, payload)
  },

  async changePassword(payload) {
    return httpClient.post(API_ENDPOINTS.USER.CHANGE_PASSWORD, payload)
  },

  async getNotifications() {
    return httpClient.get(API_ENDPOINTS.USER.NOTIFICATIONS)
  },

  async markNotificationRead(id) {
    return httpClient.post(API_ENDPOINTS.USER.MARK_NOTIFICATION_READ(id))
  },

  async markAllNotificationsRead() {
    return httpClient.post(API_ENDPOINTS.USER.MARK_ALL_NOTIFICATIONS_READ)
  },

  async getAddresses() {
    return httpClient.get(API_ENDPOINTS.USER.ADDRESSES)
  },
}

export default userService
