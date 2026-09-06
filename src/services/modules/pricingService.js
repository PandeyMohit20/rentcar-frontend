import httpClient from '@/services/api/httpClient'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'

const normalizeQuote = (quote = {}) => ({
  quoteId: quote.quoteId,
  quoteToken: quote.quoteToken,
  carId: quote.carId,
  pickupDateTime: quote.pickupDateTime,
  returnDateTime: quote.returnDateTime,
  currencyCode: quote.currencyCode,
  duration: quote.duration || null,
  pricing: quote.pricing || null,
  expiresAt: quote.expiresAt,
  availability: quote.availability || null,
})

export const pricingService = {
  async createQuote(payload) {
    return normalizeQuote((await httpClient.post(API_ENDPOINTS.PRICING.QUOTE, payload))?.data)
  },
}
export default pricingService
