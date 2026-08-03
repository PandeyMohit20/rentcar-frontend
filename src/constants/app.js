/**
 * Global application constants.
 */
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'RentCar'
export const APP_ENV = import.meta.env.VITE_APP_ENV || 'development'
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0'

export const APP_DEFAULT_LANGUAGE = 'en'
export const APP_SUPPORTED_LANGUAGES = ['en']

export const DEFAULT_PAGE_SIZE = 10
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

export const DATE_FORMAT = 'DD MMM YYYY'
export const DATE_TIME_FORMAT = 'DD MMM YYYY, hh:mm A'
export const TIME_FORMAT = 'hh:mm A'

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'rentcar_access_token',
  REFRESH_TOKEN: 'rentcar_refresh_token',
  USER: 'rentcar_user',
  THEME: 'rentcar_theme',
}

export const BOOKING_STATUS = Object.freeze({
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
})

export const PAYMENT_STATUS = Object.freeze({
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
})
