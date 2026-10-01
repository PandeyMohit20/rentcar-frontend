/**
 * Wallet API service — placeholder abstraction.
 * Real backend integration to be added later.
 */
export const walletService = {
  async getBalance() {
    return Promise.resolve({ data: { balance: 0, currency: 'INR' } })
  },

  async getTransactions(params = {}) {
    return Promise.resolve({
      data: { transactions: [], total: 0, page: params.page || 1, limit: params.limit || 10 },
    })
  },

  async getRefunds() {
    return Promise.resolve({ data: { refunds: [] } })
  },

  async recharge(payload) {
    return Promise.resolve({ data: { reference: `WAL-${Date.now()}`, ...payload } })
  },
}

export default walletService
