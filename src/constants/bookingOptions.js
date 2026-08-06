/**
 * Booking / checkout option constants.
 * UI-facing options only — pricing & validation remain server-side placeholders.
 */

export const INSURANCE_OPTIONS = [
  { value: 'basic', label: 'Basic', description: 'Standard liability coverage included.' },
  { value: 'premium', label: 'Premium', description: 'Enhanced damage & theft protection.' },
  {
    value: 'zero_depreciation',
    label: 'Zero Depreciation',
    description: 'No depreciation deduction on repairs.',
  },
  {
    value: 'roadside_assistance',
    label: 'Roadside Assistance',
    description: '24/7 on-road assistance & towing.',
  },
]

export const ADDON_OPTIONS = [
  { value: 'gps', label: 'GPS', description: 'Built-in navigation system.' },
  { value: 'child_seat', label: 'Child Seat', description: 'Safety seat for infants & kids.' },
  { value: 'fastag', label: 'Fastag', description: 'Electronic toll collection enabled.' },
  { value: 'wifi', label: 'WiFi', description: 'In-car high-speed internet hotspot.' },
  { value: 'extra_driver', label: 'Extra Driver', description: 'Authorize an additional driver.' },
  { value: 'fuel_plan', label: 'Fuel Plan', description: 'Pre-paid fuel package.' },
  { value: 'unlimited_km', label: 'Unlimited KM', description: 'No per-km distance charges.' },
  {
    value: 'doorstep_delivery',
    label: 'Doorstep Delivery',
    description: 'Car delivered to your door.',
  },
]

export const PAYMENT_METHODS = [
  { value: 'card', label: 'Credit / Debit Card' },
  { value: 'upi', label: 'UPI' },
  { value: 'netbanking', label: 'Net Banking' },
  { value: 'wallet', label: 'Wallet' },
  { value: 'gift_card', label: 'Gift Card' },
  { value: 'split', label: 'Split Payment' },
]

export const PRICE_OPTIONS = Object.freeze({
  TAX_RATE: 0.18, // 18% GST
  PLATFORM_FEE: 99,
  GST_RATE: 0.18,
})

export const BOOKING_STEPS = [
  'Dates & Locations',
  'Driver Details',
  'Insurance',
  'Add-ons',
  'Review',
]

export default {
  INSURANCE_OPTIONS,
  ADDON_OPTIONS,
  PAYMENT_METHODS,
  PRICE_OPTIONS,
  BOOKING_STEPS,
}
