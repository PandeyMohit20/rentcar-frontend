/**
 * Trip API service — placeholder abstraction.
 * Real backend integration to be added later.
 */
export const tripService = {
  async getTripSummary(payload) {
    // Placeholder: resolve with the provided trip inputs.
    return Promise.resolve({ data: { ...payload } })
  },

  async estimateTrip(payload) {
    // Placeholder: resolve with zeroed estimates (distance/fuel placeholders).
    return Promise.resolve({
      data: {
        distanceKm: null,
        estimatedFuel: null,
        estimatedCost: 0,
        ...payload,
      },
    })
  },

  async getTripHistory() {
    return Promise.resolve({ data: { trips: [] } })
  },

  async getTripDetails(id) {
    return Promise.resolve({ data: { id, timeline: [], cost: 0, rating: null, invoice: null } })
  },

  async getTripTimeline(id) {
    return Promise.resolve({ data: { id, events: [] } })
  },

  async rateTrip(id, payload) {
    return Promise.resolve({ data: { id, ...payload } })
  },
}

export default tripService
