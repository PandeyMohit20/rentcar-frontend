import test from 'node:test'
import assert from 'node:assert/strict'
import { bookingStatusPresentation } from '../src/features/payment/bookingStatusPresentation.js'

test('cancelled refunded booking reports refund and ignores its retained hold', () => {
  const result = bookingStatusPresentation(
    { status: 'CANCELLED', paymentStatus: 'refunded', holdExpiresAt: '2026-09-09T08:17:43Z' },
    { status: 'refunded' }
  )
  assert.equal(result.hasPaymentHold, false)
  assert.equal(
    result.terminalMessage,
    'Your booking is cancelled and your payment has been refunded.'
  )
})

test('cancelled booking awaiting refund never promises a completed refund', () => {
  const result = bookingStatusPresentation(
    { status: 'CANCELLED', paymentStatus: 'succeeded' },
    { status: 'succeeded' }
  )
  assert.equal(result.hasPaymentHold, false)
  assert.equal(
    result.terminalMessage,
    'Your booking is cancelled. View the booking details for any refund updates.'
  )
})

test('fresh recovery renders refunded state without a separate payment response', () => {
  assert.match(
    bookingStatusPresentation({ status: 'CANCELLED', paymentStatus: 'refunded' }).terminalMessage,
    /has been refunded/
  )
})

test('only unpaid pending bookings show a payment hold', () => {
  for (const status of ['PENDING', 'PAYMENT_PENDING']) {
    assert.equal(
      bookingStatusPresentation({ status, paymentStatus: 'pending' }).hasPaymentHold,
      true
    )
  }
  for (const status of ['CONFIRMED', 'CANCELLED', 'EXPIRED', 'ACTIVE', 'COMPLETED', 'REJECTED']) {
    assert.equal(
      bookingStatusPresentation({ status, paymentStatus: 'pending' }).hasPaymentHold,
      false
    )
  }
  assert.equal(
    bookingStatusPresentation({ status: 'PAYMENT_PENDING', paymentStatus: 'succeeded' })
      .hasPaymentHold,
    false
  )
})
