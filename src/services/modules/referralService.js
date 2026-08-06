/**
 * Referral API service — placeholder abstraction.
 * Real backend integration to be added later.
 */
export const referralService = {
  async getReferralDetails() {
    return Promise.resolve({
      data: {
        referralCode: null,
        referralLink: null,
        referredUsers: [],
        totalRewards: 0,
      },
    })
  },

  async sendInvite(payload) {
    return Promise.resolve({ data: { ...payload, sent: true } })
  },
}

export default referralService
