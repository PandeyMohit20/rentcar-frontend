import httpClient from '@/services/api/httpClient'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'

const absoluteImageUrl = (url) => {
  if (!url || /^https?:\/\//i.test(url)) return url || null
  try {
    return new URL(url, import.meta.env.VITE_API_BASE_URL).href
  } catch {
    return url
  }
}

export const normalizeCar = (car = {}) => {
  const images = [...(Array.isArray(car.images) ? car.images : [])]
    .sort((a, b) => Number(Boolean(b.isPrimary)) - Number(Boolean(a.isPrimary)))
    .map((image) => ({
      ...image,
      url: absoluteImageUrl(image.imageUrl),
      alt: image.altText || `${car.brand || ''} ${car.model || ''}`.trim(),
    }))
  return {
    id: car.id,
    brand: car.brand || '',
    model: car.model || '',
    variant: car.variant || '',
    year: car.manufacturingYear ?? null,
    fuelType: car.fuelType || '',
    transmission: car.transmission || '',
    seatingCapacity: car.seatingCapacity ?? null,
    dailyPrice: car.pricing?.dailyPrice == null ? null : Number(car.pricing.dailyPrice),
    currencyCode: car.pricing?.currencyCode || 'INR',
    primaryImageUrl: images[0]?.url || null,
    images,
    features: (Array.isArray(car.features) ? car.features : [])
      .map((feature) => ({ id: feature.id, name: feature.name, iconKey: feature.iconKey || null }))
      .filter((feature) => feature.name),
    branch: car.branch
      ? {
          id: car.branch.id,
          name: car.branch.name,
          address: car.branch.address,
          location: car.branch.location
            ? {
                id: car.branch.location.id,
                name: car.branch.location.name,
                city: car.branch.location.city
                  ? { id: car.branch.location.city.id, name: car.branch.location.city.name }
                  : null,
              }
            : null,
        }
      : null,
    vendor: car.vendor ? { id: car.vendor.id, companyName: car.vendor.companyName } : null,
    isPubliclyRentable: true,
  }
}

const normalizeList = (response) => ({
  cars: (Array.isArray(response?.data) ? response.data : []).map(normalizeCar),
  meta: response?.meta || null,
})

export const carService = {
  async searchCars(params) {
    return normalizeList(await httpClient.get(API_ENDPOINTS.CARS.SEARCH, { params }))
  },
  async getCarDetails(id) {
    return normalizeCar((await httpClient.get(API_ENDPOINTS.CARS.DETAILS(id)))?.data)
  },
  async getFeaturedCars() {
    return normalizeList(await httpClient.get(API_ENDPOINTS.CARS.FEATURED))
  },
}
export default carService
