/**
 * Shared display constants for the account module.
 * Keeps presentational labels out of business logic.
 */

export const KYC_DOCUMENT_META = [
  { key: 'pan', label: 'PAN Card', description: 'Permanent Account Number' },
  { key: 'aadhaar', label: 'Aadhaar Card', description: '12-digit unique identity' },
  { key: 'passport', label: 'Passport', description: 'Valid international passport' },
  { key: 'drivingLicense', label: 'Driving License', description: 'Valid driving license' },
]

export const KYC_STATUS_META = {
  not_submitted: { label: 'Not Submitted', color: 'default' },
  pending: { label: 'Pending Review', color: 'warning' },
  verified: { label: 'Verified', color: 'success' },
  rejected: { label: 'Rejected', color: 'error' },
}

export const BOOKING_STATUS_META = {
  upcoming: { label: 'Upcoming', color: 'info' },
  completed: { label: 'Completed', color: 'success' },
  cancelled: { label: 'Cancelled', color: 'default' },
  refunded: { label: 'Refunded', color: 'warning' },
}

export const NOTIFICATION_TYPE_META = {
  booking: { label: 'Booking', color: 'info' },
  offer: { label: 'Offer', color: 'success' },
  system: { label: 'System', color: 'default' },
  security: { label: 'Security', color: 'error' },
}

export const TICKET_STATUS_META = {
  open: { label: 'Open', color: 'info' },
  in_progress: { label: 'In Progress', color: 'warning' },
  resolved: { label: 'Resolved', color: 'success' },
  closed: { label: 'Closed', color: 'default' },
}

export const SECURITY_LEVEL_META = [
  { key: 'password', label: 'Password', description: 'Change your account password' },
  { key: 'twoFactor', label: 'Two-Factor Auth', description: 'Add an extra layer of security' },
  { key: 'sessions', label: 'Active Sessions', description: 'Manage logged-in devices' },
  { key: 'loginHistory', label: 'Login History', description: 'Review recent sign-ins' },
  { key: 'devices', label: 'Trusted Devices', description: 'Review recognised devices' },
  { key: 'deleteAccount', label: 'Delete Account', description: 'Permanently remove your account' },
]

export const PRIVACY_SETTINGS_META = [
  { key: 'profileVisibility', label: 'Profile Visibility' },
  { key: 'dataSharing', label: 'Data Sharing' },
  { key: 'marketing', label: 'Marketing Communications' },
  { key: 'cookieConsent', label: 'Cookie Consent' },
]

export const SETTINGS_SECTIONS_META = [
  { key: 'theme', label: 'Theme' },
  { key: 'language', label: 'Language' },
  { key: 'notifications', label: 'Notification Preferences' },
  { key: 'email', label: 'Email Preferences' },
  { key: 'sms', label: 'SMS Preferences' },
]

export const QUICK_ACTIONS_META = [
  { key: 'bookCar', label: 'Book a Car', to: '/search' },
  { key: 'addMoney', label: 'Add Money', to: '/account/wallet' },
  { key: 'support', label: 'Contact Support', to: '/account/support' },
  { key: 'refer', label: 'Refer a Friend', to: '/account/referral' },
]

export default {
  KYC_DOCUMENT_META,
  KYC_STATUS_META,
  BOOKING_STATUS_META,
  NOTIFICATION_TYPE_META,
  TICKET_STATUS_META,
  SECURITY_LEVEL_META,
  PRIVACY_SETTINGS_META,
  SETTINGS_SECTIONS_META,
  QUICK_ACTIONS_META,
}
