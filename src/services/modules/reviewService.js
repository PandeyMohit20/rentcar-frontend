import api from '@/services/api/axiosInstance'

const reviewService = {
  async listMyReviews(params = {}) {
    const response = await api.get('/reviews/my', {
      params,
    })

    return response.data?.data ?? response.data
  },

  async getReviewSummary() {
    const response = await api.get('/reviews/my/summary')

    return response.data?.data ?? response.data
  },

  async createReview(payload) {
    const response = await api.post('/reviews', payload)

    return response.data?.data ?? response.data
  },

  async updateReview(id, payload) {
    const response = await api.patch(`/reviews/${id}`, payload)

    return response.data?.data ?? response.data
  },

  async listCarReviews(carId, params = {}) {
    const response = await api.get(`/reviews/car/${carId}`, {
      params,
    })

    return response.data?.data ?? response.data
  },
}

export { reviewService }
export default reviewService
