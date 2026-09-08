import assert from 'node:assert/strict'
import test from 'node:test'
import authReducer, { updateUser } from '../src/redux/slices/authSlice.js'
import {
  getPaymentContact,
  runPaymentPhoneGuard,
  safePaymentReturnPath,
} from '../src/features/payment/phonePrerequisite.js'

function attempt(phone) {
  let blocked = 0
  const orders = []
  const allowed = runPaymentPhoneGuard({
    phone,
    onBlocked: () => {
      blocked += 1
    },
    onReady: (contact) => orders.push(contact),
  })
  return { allowed, blocked, orders }
}

test('missing phone blocks before payment-order creation', () => {
  for (const phone of [null, undefined, '', '   ']) {
    assert.deepEqual(attempt(phone), { allowed: false, blocked: 1, orders: [] })
  }
})

test('obviously invalid phone blocks before payment-order creation', () => {
  for (const phone of ['123', '+91 123', 'not-a-phone', '++++++++++']) {
    assert.deepEqual(attempt(phone), { allowed: false, blocked: 1, orders: [] })
  }
})

test('valid persisted phone allows one payment-order request with normalized contact', () => {
  assert.deepEqual(attempt('+91 (98765) 43210'), {
    allowed: true,
    blocked: 0,
    orders: ['+919876543210'],
  })
})

test('updated account state supplies the current persisted phone to payment', () => {
  const initial = {
    user: { id: 'customer-1', phone: null },
    isAuthenticated: true,
    isLoading: false,
    isRestoring: false,
    error: null,
  }
  const updatedUser = { id: 'customer-1', phone: '+919876543210' }
  const state = authReducer(initial, updateUser(updatedUser))

  assert.equal(state.user, updatedUser)
  assert.equal(getPaymentContact(state.user.phone), '+919876543210')
})

test('only a local booking status path is accepted as payment return context', () => {
  assert.equal(
    safePaymentReturnPath('/booking/status/11111111-1111-4111-8111-111111111111'),
    '/booking/status/11111111-1111-4111-8111-111111111111'
  )
  for (const value of [
    '//example.com/booking/status/id',
    '/booking/status/id?quoteToken=secret',
    '/booking/status/id/extra',
    '/account/profile',
  ]) {
    assert.equal(safePaymentReturnPath(value), '')
  }
})
