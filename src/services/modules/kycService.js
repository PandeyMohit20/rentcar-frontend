/**
 * KYC API service — placeholder abstraction.
 * Real backend integration to be added later.
 */
export const kycService = {
  async getStatus() {
    return Promise.resolve({
      data: {
        status: 'unverified',
        pan: { status: 'not_submitted' },
        aadhaar: { status: 'not_submitted' },
        passport: { status: 'not_submitted' },
        drivingLicense: { status: 'not_submitted' },
      },
    })
  },

  async submitDocument(type, payload) {
    return Promise.resolve({ data: { type, status: 'pending', ...payload } })
  },

  async resubmitDocument(type, payload) {
    return Promise.resolve({ data: { type, status: 'pending', ...payload } })
  },
}

export default kycService
