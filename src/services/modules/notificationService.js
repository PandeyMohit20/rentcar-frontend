/**
 * Notification API service — placeholder abstraction.
 * Real backend integration to be added later.
 */
export const notificationService = {
  async listNotifications(params = {}) {
    return Promise.resolve({
      data: { notifications: [], total: 0, page: params.page || 1, limit: params.limit || 10 },
    })
  },

  async getUnreadCount() {
    return Promise.resolve({ data: { count: 0 } })
  },

  async markRead(id) {
    return Promise.resolve({ data: { id, isRead: true } })
  },

  async markAllRead() {
    return Promise.resolve({ data: { success: true } })
  },
}

export default notificationService
