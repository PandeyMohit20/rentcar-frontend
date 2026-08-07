/**
 * General formatting helpers.
 */
export { formatDate, formatDateTime, formatTime, fromNow } from './date'

export const formatCurrency = (amount, currency = 'INR', locale = 'en-IN') => {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) {
    return '—'
  }
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount))
}

export const formatNumber = (value, locale = 'en-IN') => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '—'
  }
  return new Intl.NumberFormat(locale).format(Number(value))
}

export const formatPercentage = (value, fractionDigits = 1) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '—'
  }
  return `${Number(value).toFixed(fractionDigits)}%`
}

export const capitalize = (str = '') =>
  str.length ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : ''

export const titleCase = (str = '') =>
  str
    .toLowerCase()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => capitalize(word))
    .join(' ')

export const truncate = (str = '', length = 50) =>
  str.length > length ? `${str.slice(0, length)}…` : str

export const initials = (firstName = '', lastName = '') =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()

export const maskEmail = (email = '') => {
  const [name, domain] = email.split('@')
  if (!domain) return email
  const maskedName = name.length > 2 ? `${name.slice(0, 2)}***` : `${name[0]}***`
  return `${maskedName}@${domain}`
}

export const maskPhone = (phone = '') =>
  phone.length > 6 ? `${phone.slice(0, 3)}****${phone.slice(-2)}` : phone
