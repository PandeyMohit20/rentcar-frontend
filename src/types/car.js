/**
 * Car domain shape contracts (documentation only).
 */
export const CarShape = Object.freeze({
  id: 'string',
  name: 'string',
  brand: 'string',
  model: 'string',
  year: 'number',
  images: 'string[]',
  fuelType: 'string',
  transmission: 'string',
  category: 'string',
  seatingCapacity: 'number',
  luggageCapacity: 'number',
  mileage: 'number',
  pricePerDay: 'number',
  pricePerHour: 'number',
  weeklyDiscount: 'number',
  monthlyDiscount: 'number',
  securityDeposit: 'number',
  insuranceCharge: 'number',
  platformFee: 'number',
  taxes: 'number',
  location: 'string',
  distanceKm: 'number',
  rating: 'number',
  reviewCount: 'number',
  isAvailable: 'boolean',
  instantBooking: 'boolean',
  features: 'string[]',
  amenities: 'string[]',
  description: 'string',
  host: 'object',
  policies: 'object',
  insurance: 'object',
})

export const PriceBreakdownShape = Object.freeze({
  dailyPrice: 'number',
  weeklyPrice: 'number',
  monthlyPrice: 'number',
  securityDeposit: 'number',
  insuranceCharge: 'number',
  platformFee: 'number',
  taxes: 'number',
  discount: 'number',
  couponDiscount: 'number',
  total: 'number',
})

export const AvailabilityResponseShape = Object.freeze({
  carId: 'string',
  blockedDates: 'string[]',
  availableDates: 'string[]',
  holidays: 'string[]',
  minBookingDays: 'number',
  maxBookingDays: 'number',
})

export default CarShape
