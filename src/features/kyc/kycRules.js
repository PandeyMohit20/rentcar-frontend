export const KYC_TYPES = [
  {
    key: 'driving_license',
    label: 'Driving Licence',
    required: true,
    description: 'A clear copy of your current driving licence.',
  },
  {
    key: 'pan',
    label: 'PAN Card',
    required: false,
    description: 'Your Permanent Account Number card.',
  },
  {
    key: 'identity_proof',
    label: 'Identity Proof',
    required: false,
    description: 'A document that confirms your identity.',
  },
  {
    key: 'address_proof',
    label: 'Address Proof',
    required: false,
    description: 'A document that confirms your address.',
  },
]
export const MAX_KYC_SIZE = 10 * 1024 * 1024
export const KYC_ACCEPT = '.pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png'
export function validateKycFile(file) {
  if (!file) return 'Choose a document to upload.'
  if (
    !['application/pdf', 'image/jpeg', 'image/png'].includes(file.type) ||
    !/\.(pdf|jpe?g|png)$/i.test(file.name)
  )
    return 'Choose a PDF, JPEG or PNG file.'
  if (file.size > MAX_KYC_SIZE) return 'File is too large. Choose a file up to 10 MB.'
  if (file.size === 0) return 'This file is empty. Choose another file.'
  return null
}
export function isCurrentLicence(document) {
  return (
    document.documentType === 'driving_license' &&
    ['pending', 'verified'].includes(document.status) &&
    Boolean(document.expiresAt) &&
    new Date(document.expiresAt).getTime() > Date.now()
  )
}
export function kycDate(value) {
  if (!value || Number.isNaN(Date.parse(value))) return 'Not provided'
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value))
}

export function validateKycExpiry(value, issuedAt, required) {
  if (
    value &&
    (Number.isNaN(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value)
  )
    return 'Enter a valid expiry date.'
  if (value && issuedAt && value < issuedAt) return 'Expiry must be on or after the issue date.'
  if (required && (!value || new Date(value).getTime() <= Date.now()))
    return 'Use a current licence with a future expiry date.'
  return true
}
