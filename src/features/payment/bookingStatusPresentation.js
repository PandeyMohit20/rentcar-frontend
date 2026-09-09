export function bookingStatusPresentation(booking, payment) {
  const refunded = payment?.status === 'refunded' || booking?.paymentStatus === 'refunded'
  const cancelled = booking?.status === 'CANCELLED'
  const hasPaymentHold =
    ['PENDING', 'PAYMENT_PENDING'].includes(booking?.status) &&
    !['succeeded', 'refunded'].includes(booking?.paymentStatus) &&
    !['succeeded', 'refunded'].includes(payment?.status)

  return {
    hasPaymentHold,
    terminalMessage: cancelled
      ? refunded
        ? 'Your booking is cancelled and your payment has been refunded.'
        : 'Your booking is cancelled. View the booking details for any refund updates.'
      : refunded
        ? 'Your payment has been refunded. View the booking details for your booking status.'
        : null,
  }
}
