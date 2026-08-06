/**
 * Security API service — placeholder abstraction.
 * Real backend integration to be added later.
 */
export const securityService = {
  async changePassword(payload) {
    return Promise.resolve({ data: { success: true, ...payload } })
  },

  async getTwoFactorStatus() {
    return Promise.resolve({ data: { enabled: false, method: null } })
  },

  async enableTwoFactor(payload) {
    return Promise.resolve({ data: { enabled: true, ...payload } })
  },

  async disableTwoFactor(payload) {
    return Promise.resolve({ data: { enabled: false, ...payload } })
  },

  async getLoginHistory() {
    return Promise.resolve({ data: { records: [] } })
  },

  async getActiveSessions() {
    return Promise.resolve({ data: { sessions: [] } })
  },

  async revokeSession(id) {
    return Promise.resolve({ data: { id, revoked: true } })
  },

  async getTrustedDevices() {
    return Promise.resolve({ data: { devices: [] } })
  },

  async revokeDevice(id) {
    return Promise.resolve({ data: { id, revoked: true } })
  },
}

export default securityService
