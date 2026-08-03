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
}

export default QUERY_KEYS
