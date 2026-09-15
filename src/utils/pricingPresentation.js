export const PRICING_UNAVAILABLE =
  'Pricing is currently unavailable for this vehicle. Please try another car or try again later.'
export function pricingErrorMessage(error) {
  const code = error?.data?.error?.code || ''
  if (
    /(APPROVAL|APPROVED|POLICY|GST|CESS|TAX|ISSUER|SELLER|INVALID_MONEY|AMOUNT_OUT_OF_RANGE)/.test(
      code
    )
  )
    return PRICING_UNAVAILABLE
  if (
    code === 'CUSTOMER_BILLING_REQUIRED' ||
    code === 'CUSTOMER_BILLING_STATE_REQUIRED' ||
    code === 'RECIPIENT_TAX_STATUS_REQUIRED'
  )
    return 'Please sign in and complete your billing details to request a price.'
  return error?.message || PRICING_UNAVAILABLE
}
export function taxPresentation(snapshot) {
  if (!snapshot || snapshot.taxMode === 'UAT_BYPASS') return { mode: 'none' }
  if (snapshot.policyStatus !== 'confirmed')
    return { mode: 'pending', message: 'Pricing details are currently unavailable.' }
  if (snapshot.gstRegistrationStatus === 'UNREGISTERED')
    return { mode: 'unregistered', message: 'GST is not charged by the seller.' }
  return { mode: 'registered' }
}
