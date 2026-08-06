/**
 * Centralized TanStack Query keys.
 * Organize by domain to allow invalidations at any granularity.
 */
export const QUERY_KEYS = {
  AUTH: {
    ME: ['auth', 'me'],
    SESSION: ['auth', 'session'],
  },
  CARS: {
    ALL: ['cars'],
    SEARCH: (params) => ['cars', 'search', params],
    DETAILS: (id) => ['cars', 'details', id],
    FEATURED: ['cars', 'featured'],
    POPULAR: ['cars', 'popular'],
    REVIEWS: (id) => ['cars', 'reviews', id],
    PRICE: (params) => ['cars', 'price', params],
    SIMILAR: (id) => ['cars', 'similar', id],
    AVAILABILITY: (id, params) => ['cars', 'availability', id, params],
    BY_IDS: (ids) => ['cars', 'by-ids', ids],
  },
  BOOKINGS: {
    ALL: ['bookings'],
    DETAILS: (id) => ['bookings', 'details', id],
    HISTORY: (params) => ['bookings', 'history', params],
  },
  PAYMENTS: {
    METHODS: ['payments', 'methods'],
    STATUS: (id) => ['payments', 'status', id],
  },
  WISHLIST: {
    ALL: ['wishlist'],
  },
  OFFERS: {
    ALL: ['offers'],
    DETAILS: (id) => ['offers', 'details', id],
  },
  USER: {
    PROFILE: ['user', 'profile'],
    NOTIFICATIONS: ['user', 'notifications'],
    ADDRESSES: ['user', 'addresses'],
  },
  CONTENT: {
    FAQ: ['content', 'faqs'],
    BLOG: ['content', 'blog'],
    BLOG_DETAILS: (slug) => ['content', 'blog', slug],
    LOCATIONS: ['content', 'locations'],
    ABOUT: ['content', 'about'],
    LEGAL: ['content', 'legal'],
  },

  // ── Account / Dashboard ──────────────────────────────────────────────
  DASHBOARD: {
    OVERVIEW: ['dashboard', 'overview'],
    WIDGETS: ['dashboard', 'widgets'],
  },
  PROFILE: {
    DETAILS: ['profile', 'details'],
    EMERGENCY_CONTACT: ['profile', 'emergency-contact'],
    COMPLETION: ['profile', 'completion'],
  },
  KYC: {
    STATUS: ['kyc', 'status'],
    DOCUMENTS: ['kyc', 'documents'],
  },
  WALLET: {
    BALANCE: ['wallet', 'balance'],
    TRANSACTIONS: ['wallet', 'transactions'],
    REFUNDS: ['wallet', 'refunds'],
  },
  TRIPS: {
    ALL: ['trips'],
    DETAILS: (id) => ['trips', 'details', id],
    TIMELINE: (id) => ['trips', 'timeline', id],
  },
  ADDRESSES: {
    ALL: ['addresses'],
  },
  REVIEWS: {
    ALL: ['reviews'],
    SUMMARY: ['reviews', 'summary'],
  },
  SUPPORT: {
    TICKETS: ['support', 'tickets'],
    TICKET_DETAILS: (id) => ['support', 'tickets', id],
    FAQS: ['support', 'faqs'],
  },
  REFERRAL: {
    DETAILS: ['referral', 'details'],
  },
  REWARDS: {
    BALANCE: ['rewards', 'balance'],
    HISTORY: ['rewards', 'history'],
  },
  SETTINGS: {
    PREFERENCES: ['settings', 'preferences'],
    NOTIFICATIONS: ['settings', 'notifications'],
    LANGUAGE: ['settings', 'language'],
  },
  SECURITY: {
    SESSIONS: ['security', 'sessions'],
    DEVICES: ['security', 'devices'],
    LOGIN_HISTORY: ['security', 'login-history'],
    TWO_FACTOR: ['security', 'two-factor'],
  },
  DOCUMENTS: {
    ALL: ['documents'],
  },
}

export default QUERY_KEYS
