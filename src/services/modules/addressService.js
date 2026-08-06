/**
 * Address API service — placeholder abstraction.
 * Real backend integration to be added later.
 */
export const addressService = {
  async listAddresses() {
    return Promise.resolve({ data: { addresses: [] } })
  },

  async createAddress(payload) {
    return Promise.resolve({ data: { id: `ADDR-${Date.now()}`, ...payload } })
  },

  async updateAddress(id, payload) {
    return Promise.resolve({ data: { id, ...payload } })
  },

  async deleteAddress(id) {
    return Promise.resolve({ data: { id, deleted: true } })
  },

  async setDefault(id) {
    return Promise.resolve({ data: { id, isDefault: true } })
  },
}

export default addressService
