/**
 * Invoice API service — placeholder abstraction.
 * Real backend integration to be added later.
 */
export const invoiceService = {
  async getInvoice(bookingId) {
    // Placeholder: resolve with a reference to the booking.
    return Promise.resolve({ data: { bookingId, reference: `INV-${Date.now()}` } })
  },

  async downloadInvoice(bookingId) {
    // Placeholder: resolve with a placeholder download descriptor.
    return Promise.resolve({ data: { bookingId, url: null, status: 'pending' } })
  },
}

export default invoiceService
