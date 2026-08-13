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
  PRIVACY_POLICY: '/privacy-policy',
  TERMS_CONDITIONS: '/terms-and-conditions',
  REFUND_POLICY: '/refund-policy',
  CANCELLATION_POLICY: '/cancellation-policy',
  CAR_CATEGORIES: '/car-categories',
  MEMBERSHIP: '/membership',
  LOCATIONS: '/locations',
  COMPARE: '/compare',
  NOT_FOUND: '/404',

  // Auth routes (guest only)
  // Auth routes (guest only)
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
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
  BOOKING_CONFIRMATION: '/booking/confirmation',
  BOOKING_SUCCESS: '/booking/success',
  BOOKING_FAILED: '/booking/failed',
  INVOICE_PREVIEW: '/booking/invoice',
  TRIP_SUMMARY: '/booking/trip-summary',

  // ── Account / Dashboard (authenticated) ──────────────────────────────
  ACCOUNT: '/account',
  DASHBOARD: '/account',
  ACCOUNT_DASHBOARD: '/account/dashboard',
  MY_PROFILE: '/account/profile',
  EDIT_PROFILE: '/account/profile/edit',
  KYC: '/account/kyc',
  DRIVING_LICENSE: '/account/driving-license',
  WALLET: '/account/wallet',
  WALLET_HISTORY: '/account/wallet/history',
  MY_BOOKINGS: '/account/bookings',
  BOOKING_DETAILS: '/account/bookings/:id',
  BOOKING_DETAILS_WITH_ID: (id) => `/account/bookings/${id}`,
  TRIP_HISTORY: '/account/trips',
  TRIP_DETAILS: '/account/trips/:id',
  SAVED_ADDRESSES: '/account/addresses',
  ACCOUNT_WISHLIST: '/account/wishlist',
  ACCOUNT_NOTIFICATIONS: '/account/notifications',
  REVIEWS: '/account/reviews',
  ACCOUNT_SUPPORT: '/account/support',
  CREATE_TICKET: '/account/support/new',
  TICKET_DETAILS: '/account/support/tickets/:id',
  TICKET_DETAILS_WITH_ID: (id) => `/account/support/tickets/${id}`,
  REFERRAL: '/account/referral',
  REWARDS: '/account/rewards',
  ACCOUNT_SETTINGS: '/account/settings',
  SECURITY: '/account/security',
  PRIVACY: '/account/privacy',
  DEVICES: '/account/devices',
  DOCUMENTS: '/account/documents',
  DELETE_ACCOUNT: '/account/delete',
}

export default ROUTES
