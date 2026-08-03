/**
 * Booking domain shape contracts (documentation only).
 */
export const BookingShape = Object.freeze({
  id: 'string',
  carId: 'string',
  userId: 'string',
  startDate: 'string',
  endDate: 'string',
  pickupLocation: 'string',
  dropLocation: 'string',
  totalAmount: 'number',
  status: 'string',
  paymentStatus: 'string',
  createdAt: 'string',
})

export const CheckoutShape = Object.freeze({
  bookingId: 'string',
  amount: 'number',
  paymentMethod: 'string',
  couponCode: 'string',
})

export default BookingShape
