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
  seatingCapacity: 'number',
  luggageCapacity: 'number',
  pricePerDay: 'number',
  pricePerHour: 'number',
  location: 'string',
  rating: 'number',
  reviewCount: 'number',
  isAvailable: 'boolean',
  features: 'string[]',
  description: 'string',
})

export default CarShape
