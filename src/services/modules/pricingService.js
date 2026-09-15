import httpClient from '@/services/api/httpClient'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { pricingErrorMessage } from '@/utils/pricingPresentation'

const normalizeQuote = (quote = {}) => ({
  quoteId: quote.quoteId,
  quoteToken: quote.quoteToken,
  carId: quote.carId,
  pickupDateTime: quote.pickupDateTime,
  returnDateTime: quote.returnDateTime,
  currencyCode: quote.currencyCode,
  duration: quote.duration || null,
  pricing: quote.pricing || null,
  financialSnapshot: quote.financialSnapshot || quote.pricing?.financialSnapshot || null,
  expiresAt: quote.expiresAt,
  availability: quote.availability || null,
})

export const pricingService = {
  async createQuote(payload) {
    try {
      return normalizeQuote((await httpClient.post(API_ENDPOINTS.PRICING.QUOTE, payload))?.data)
    } catch (error) {
      throw { ...error, message: pricingErrorMessage(error) }
    }
  },
}
export default pricingService
