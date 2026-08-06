/**
 * Centralized car filter & sort option constants.
 * These drive the Search/Listing filter UI and are intentionally
 * UI-facing only — filtering/sorting happens server-side via the API.
 */
export const CAR_BRANDS = [
  'Maruti Suzuki',
  'Hyundai',
  'Tata',
  'Mahindra',
  'Toyota',
  'Honda',
  'Kia',
  'MG',
  'Skoda',
  'Volkswagen',
  'Ford',
  'Renault',
]

export const CAR_CATEGORIES = [
  { value: 'hatchback', label: 'Hatchback' },
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'muv', label: 'MUV' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'electric', label: 'Electric' },
  { value: 'convertible', label: 'Convertible' },
  { value: 'premium', label: 'Premium' },
]

export const SEAT_OPTIONS = [2, 4, 5, 6, 7, 8]

export const FUEL_OPTIONS = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'electric', label: 'Electric' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'cng', label: 'CNG' },
]

export const TRANSMISSION_OPTIONS = [
  { value: 'manual', label: 'Manual' },
  { value: 'automatic', label: 'Automatic' },
]

export const AMENITY_OPTIONS = [
  { value: 'airConditioning', label: 'Air Conditioning' },
  { value: 'bluetooth', label: 'Bluetooth' },
  { value: 'gps', label: 'GPS' },
  { value: 'fastCharging', label: 'Fast Charging' },
  { value: 'homeDelivery', label: 'Home Delivery' },
  { value: 'unlimitedKm', label: 'Unlimited KM' },
  { value: 'freeCancellation', label: 'Free Cancellation' },
]

export const SORT_OPTIONS = [
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Rating' },
  { value: 'newest', label: 'Newest' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'distance', label: 'Distance' },
]

export const DEFAULT_PRICE_RANGE = [500, 20000]

export default {
  CAR_BRANDS,
  CAR_CATEGORIES,
  SEAT_OPTIONS,
  FUEL_OPTIONS,
  TRANSMISSION_OPTIONS,
  AMENITY_OPTIONS,
  SORT_OPTIONS,
  DEFAULT_PRICE_RANGE,
}
