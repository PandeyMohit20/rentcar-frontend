// Only the ownership-checked booking read can associate a payment with this trip.
export const hasCapturedPayment = (payment) =>
  Boolean(
    payment &&
    (['succeeded', 'refunded'].includes(payment.status) ||
      payment.paidAt ||
      payment.providerPaymentId)
  )

const needsReview = (payment) =>
  ['review_required', 'late_payment_conflict'].includes(payment?.operationalStatus)

export function recoveredPayment(booking, details) {
  const summary = booking?.payment
  if (!summary?.id) return null
  if (!details || details.id !== summary.id || details.bookingId !== booking.id) return summary
  // A cached/delayed pending response cannot undo captured monetary evidence.
  if (hasCapturedPayment(summary) && !hasCapturedPayment(details)) return summary
  if (needsReview(summary) && !needsReview(details)) return summary
  return details
}

export function paymentEligible(booking, payment, now) {
  return Boolean(
    booking &&
    Object.hasOwn(booking, 'payment') &&
    booking.status === 'PAYMENT_PENDING' &&
    booking.paymentStatus === 'pending' &&
    new Date(booking.holdExpiresAt).getTime() > now &&
    !hasCapturedPayment(payment) &&
    !needsReview(payment) &&
    (!payment ||
      (['pending', 'failed'].includes(payment.status) && payment.operationalStatus === 'normal')) &&
    (!payment ||
      (Number(payment.amount) === Number(booking.totalAmount) &&
        payment.currencyCode === booking.currencyCode))
  )
}
