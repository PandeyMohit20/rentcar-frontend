/**
 * Lightweight utility validators (non-schema).
 */
export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ''))

export const isPhone = (value) => /^[+]?[\d\s-]{10,15}$/.test(String(value || ''))

export const isUrl = (value) => {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export const isStrongPassword = (value) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(String(value || ''))

export const isNumeric = (value) => /^\d+$/.test(String(value || ''))

export const isDateInFuture = (date) => new Date(date) > new Date()
