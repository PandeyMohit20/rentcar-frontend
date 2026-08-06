/**
 * Dashboard API service — placeholder abstraction.
 * Real backend integration to be added later.
 */
export const dashboardService = {
  async getOverview() {
    return Promise.resolve({
      data: {
        upcomingTrips: [],
        recentBookings: [],
        walletBalance: 0,
        rewardPoints: 0,
        notifications: [],
        supportTickets: [],
        profileCompletion: 0,
        kycStatus: 'unverified',
        quickActions: [],
      },
    })
  },

  async getWidgets() {
    return Promise.resolve({ data: {} })
  },
}

export default dashboardService
