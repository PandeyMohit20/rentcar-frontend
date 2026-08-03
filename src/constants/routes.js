/**
 * Route path constants.
 * Single source of truth for all navigation paths.
 */
export const ROUTES = {
  // Public routes
  HOME: '/',
  SEARCH: '/search',
  CAR_DETAILS: '/cars/:id',
  CAR_DETAILS_WITH_ID: (id) => `/cars/${id}`,
  OFFERS: '/offers',
  ABOUT: '/about',
  CONTACT: '/contact',
  FAQ: '/faq',
  BLOG: '/blog',
  LEGAL: '/legal',
  NOT_FOUND: '/404',

  // Auth routes (guest only)
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Protected routes (authenticated only)
  BOOKING: '/booking/:carId',
  BOOKING_WITH_CAR: (carId) => `/booking/${carId}`,
  CHECKOUT: '/checkout',
  PAYMENT: '/payment',
  BOOKING_HISTORY: '/booking-history',
  WISHLIST: '/wishlist',
  PROFILE: '/profile',
  NOTIFICATIONS: '/notifications',
  SUPPORT: '/support',
}

export default ROUTES
