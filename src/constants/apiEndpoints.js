/**
 * Centralized API endpoint definitions.
 * All endpoint paths are relative to VITE_API_BASE_URL.
 */
export const API_ENDPOINTS = {
  // ── Authentication ─────────────────────────────────────────────────────
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },

  // ── Cars ───────────────────────────────────────────────────────────────
  CARS: {
    LIST: '/cars',
    SEARCH: '/cars/search',
    DETAILS: (id) => `/cars/${id}`,
    FEATURED: '/cars/featured',
    POPULAR: '/cars/popular',
    REVIEWS: (id) => `/cars/${id}/reviews`,
    PRICE: '/cars/price-estimate',
  },

  // ── Bookings ───────────────────────────────────────────────────────────
  BOOKINGS: {
    LIST: '/bookings',
    DETAILS: (id) => `/bookings/${id}`,
    CREATE: '/bookings',
    UPDATE: (id) => `/bookings/${id}`,
    CANCEL: (id) => `/bookings/${id}/cancel`,
    RESCHEDULE: (id) => `/bookings/${id}/reschedule`,
    HISTORY: '/bookings/history',
    INVOICE: (id) => `/bookings/${id}/invoice`,
  },

  // ── Payments ───────────────────────────────────────────────────────────
  PAYMENTS: {
    CREATE: '/payments',
    VERIFY: '/payments/verify',
    METHODS: '/payments/methods',
    REFUND: (id) => `/payments/${id}/refund`,
  },

  // ── Wishlist ───────────────────────────────────────────────────────────
  WISHLIST: {
    LIST: '/wishlist',
    ADD: '/wishlist',
    REMOVE: (id) => `/wishlist/${id}`,
    CHECK: (id) => `/wishlist/check/${id}`,
  },

  // ── Offers ─────────────────────────────────────────────────────────────
  OFFERS: {
    LIST: '/offers',
    DETAILS: (id) => `/offers/${id}`,
    APPLY: '/offers/apply',
    VALIDATE: '/offers/validate',
  },

  // ── User / Profile ─────────────────────────────────────────────────────
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    CHANGE_PASSWORD: '/user/change-password',
    NOTIFICATIONS: '/user/notifications',
    MARK_NOTIFICATION_READ: (id) => `/user/notifications/${id}/read`,
    MARK_ALL_NOTIFICATIONS_READ: '/user/notifications/read-all',
    ADDRESSES: '/user/addresses',
  },

  // ── Content / Static ───────────────────────────────────────────────────
  CONTENT: {
    FAQ: '/content/faqs',
    BLOG: '/content/blog',
    BLOG_DETAILS: (slug) => `/content/blog/${slug}`,
    LOCATIONS: '/content/locations',
    SUPPORT: '/content/support',
    ABOUT: '/content/about',
    LEGAL: '/content/legal',
  },
}

export default API_ENDPOINTS
