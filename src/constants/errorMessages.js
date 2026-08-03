/**
 * Centralized user-facing error messages.
 */
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your internet connection.',
  SERVER: 'Something went wrong on our side. Please try again later.',
  UNAUTHORIZED: 'Your session has expired. Please sign in again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource could not be found.',
  VALIDATION: 'Please check the highlighted fields and try again.',
  TIMEOUT: 'The request took too long to complete. Please try again.',
  GENERIC: 'An unexpected error occurred. Please try again.',

  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password.',
    EMAIL_IN_USE: 'An account with this email already exists.',
    WEAK_PASSWORD: 'Password must be at least 8 characters.',
    PASSWORD_MISMATCH: 'Passwords do not match.',
    INVALID_TOKEN: 'This link is invalid or has expired.',
  },

  BOOKING: {
    CAR_UNAVAILABLE: 'This car is no longer available for the selected dates.',
    MAX_CAPACITY: 'Booking limit reached for the selected period.',
    CANNOT_CANCEL: 'This booking cannot be cancelled at this stage.',
  },

  PAYMENT: {
    CARD_DECLINED: 'Your card was declined. Please try another payment method.',
    INSUFFICIENT_FUNDS: 'Insufficient funds for this transaction.',
  },
}

export default ERROR_MESSAGES
