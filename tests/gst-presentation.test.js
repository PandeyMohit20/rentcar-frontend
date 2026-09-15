import test from 'node:test'
import assert from 'node:assert/strict'
import {
  taxPresentation,
  pricingErrorMessage,
  PRICING_UNAVAILABLE,
} from '../src/utils/pricingPresentation.js'
test('unregistered presentation is distinct from registered zero percent', () => {
  assert.deepEqual(
    taxPresentation({ policyStatus: 'confirmed', gstRegistrationStatus: 'UNREGISTERED' }),
    { mode: 'unregistered', message: 'GST is not charged by the seller.' }
  )
  assert.equal(
    taxPresentation({
      policyStatus: 'confirmed',
      gstRegistrationStatus: 'REGISTERED',
      tax: { rate: 0 },
    }).mode,
    'registered'
  )
  assert.equal(taxPresentation(null).mode, 'none')
  assert.equal(taxPresentation({ policyStatus: 'pending' }).mode, 'pending')
})
test('pricing approval errors become customer copy while the diagnostic code remains intact', () => {
  for (const code of [
    'PARTIALLY_APPROVED_REQUIRES_RATE_AND_CESS_CONFIRMATION',
    'GST_REGISTRATION_STATUS_REQUIRED',
    'TAX_POLICY_CONFIGURATION_INVALID',
    'UNREGISTERED_DOCUMENT_APPROVAL_REQUIRED',
  ]) {
    const error = { status: 409, message: code, data: { error: { code } } }
    assert.equal(pricingErrorMessage(error), PRICING_UNAVAILABLE)
    assert.equal(error.data.error.code, code)
  }
})
test('unrelated network and availability errors are retained', () => {
  assert.equal(
    pricingErrorMessage({ message: 'Connection interrupted.' }),
    'Connection interrupted.'
  )
  assert.equal(
    pricingErrorMessage({ message: 'Car is unavailable.', data: { error: { code: 'CONFLICT' } } }),
    'Car is unavailable.'
  )
})
