/**
 * Settings API service — placeholder abstraction.
 * Real backend integration to be added later.
 */
export const settingsService = {
  async getPreferences() {
    return Promise.resolve({
      data: {
        theme: 'light',
        language: 'en',
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: true,
        marketingEmails: false,
      },
    })
  },

  async updatePreferences(payload) {
    return Promise.resolve({ data: { ...payload } })
  },

  async updateTheme(payload) {
    return Promise.resolve({ data: { ...payload } })
  },

  async updateLanguage(payload) {
    return Promise.resolve({ data: { ...payload } })
  },

  async updateNotificationPreferences(payload) {
    return Promise.resolve({ data: { ...payload } })
  },
}

export default settingsService
