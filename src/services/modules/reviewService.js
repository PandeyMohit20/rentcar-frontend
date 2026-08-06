/**
 * Reviews API service — placeholder abstraction.
 * Real backend integration to be added later.
 */
export const reviewService = {
  async listMyReviews() {
    return Promise.resolve({ data: { reviews: [] } })
  },

  async getReviewSummary() {
    return Promise.resolve({ data: { average: 0, total: 0, breakdown: {} } })
  },

  async createReview(payload) {
    return Promise.resolve({ data: { id: `REV-${Date.now()}`, ...payload } })
  },

  async updateReview(id, payload) {
    return Promise.resolve({ data: { id, ...payload } })
  },
}

export default reviewService
