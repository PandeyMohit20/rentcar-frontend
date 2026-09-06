import httpClient from '@/services/api/httpClient'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'

export const invoiceService = {
  async getForBooking(bookingId) {
    return (await httpClient.get(API_ENDPOINTS.BOOKINGS.INVOICE(bookingId)))?.data
  },

  async getById(invoiceId) {
    return (await httpClient.get(API_ENDPOINTS.INVOICES.DETAILS(invoiceId)))?.data
  },
}

export default invoiceService
