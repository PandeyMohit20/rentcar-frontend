const PHONE_INPUT_PATTERN = /^\+?[0-9\s\-()]+$/
const PAYMENT_PHONE_PATTERN = /^\+?[0-9]{10,15}$/
const PAYMENT_RETURN_PATTERN = /^\/booking\/status\/[^/?#\\]+$/

// Match the account API's normalization: formatting characters are not persisted.
export function normalizeAccountPhone(value) {
  if (typeof value !== 'string') return ''
  const phone = value.trim()
  if (!phone || !PHONE_INPUT_PATTERN.test(phone)) return ''
  return phone.replace(/[\s\-()]/g, '')
}

export function getPaymentContact(value) {
  const phone = normalizeAccountPhone(value)
  return PAYMENT_PHONE_PATTERN.test(phone) ? phone : ''
}

export function hasValidPaymentPhone(value) {
  return Boolean(getPaymentContact(value))
}

export function runPaymentPhoneGuard({ phone, onBlocked, onReady }) {
  const contact = getPaymentContact(phone)
  if (!contact) {
    onBlocked()
    return false
  }
  onReady(contact)
  return true
}

export function safePaymentReturnPath(value) {
  return typeof value === 'string' && PAYMENT_RETURN_PATTERN.test(value) ? value : ''
}
