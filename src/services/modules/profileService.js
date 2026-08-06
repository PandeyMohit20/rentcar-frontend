/**
 * Profile API service — placeholder abstraction.
 * Real backend integration to be added later.
 */
export const profileService = {
  async getProfile() {
    return Promise.resolve({
      data: {
        id: null,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        avatar: null,
        emergencyContact: null,
        preferences: {},
      },
    })
  },

  async updateProfile(payload) {
    return Promise.resolve({ data: { ...payload } })
  },

  async getEmergencyContact() {
    return Promise.resolve({ data: null })
  },

  async updateEmergencyContact(payload) {
    return Promise.resolve({ data: { ...payload } })
  },

  async getProfileCompletion() {
    return Promise.resolve({ data: { percentage: 0, missing: [] } })
  },
}

export default profileService
