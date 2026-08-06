/**
 * Coupon API service — placeholder abstraction.
 * Real backend integration to be added later.
 */
export const couponService = {
  async listCoupons() {
    // Placeholder: return an empty list of available coupons.
    return Promise.resolve({ data: { coupons: [] } })
  },

  async applyCoupon(code) {
    // Placeholder: resolve with the coupon code as a pseudo-applied coupon.
    return Promise.resolve({ data: { code, discount: 0, applied: true } })
  },

  async removeCoupon() {
    // Placeholder: always resolves successfully.
    return Promise.resolve({ data: { removed: true } })
  },

  async validateCoupon(code) {
    // Placeholder: accept any non-empty code as valid.
    return Promise.resolve({ data: { code, valid: Boolean(code) } })
  },
}

export default couponService
