/**
 * Rewards API service — placeholder abstraction.
 * Real backend integration to be added later.
 */
export const rewardService = {
  async getBalance() {
    return Promise.resolve({ data: { points: 0, currency: 'INR' } })
  },

  async getRewardHistory() {
    return Promise.resolve({ data: { rewards: [] } })
  },

  async redeem(payload) {
    return Promise.resolve({ data: { reference: `RWD-${Date.now()}`, ...payload } })
  },
}

export default rewardService
