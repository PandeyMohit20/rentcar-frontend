const RECOVERY_KEY = 'rentcar_booking_recovery'
let preCreateAttempt = null

const createUuid = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (character) => {
    const random = globalThis.crypto?.getRandomValues
      ? globalThis.crypto.getRandomValues(new Uint8Array(1))[0] % 16
      : Math.floor(Math.random() * 16)
    const value = character === 'x' ? random : (random & 0x3) | 0x8
    return value.toString(16)
  })
}

const readRecovery = () => {
  try {
    return JSON.parse(window.sessionStorage.getItem(RECOVERY_KEY))
  } catch {
    return null
  }
}

const writeRecovery = (value) => {
  window.sessionStorage.setItem(RECOVERY_KEY, JSON.stringify(value))
  return value
}

export const bookingAttemptSession = {
  getOrCreateKey(contextKey) {
    if (!preCreateAttempt || preCreateAttempt.contextKey !== contextKey) {
      preCreateAttempt = { contextKey, idempotencyKey: createUuid() }
    }
    return preCreateAttempt.idempotencyKey
  },
  clearPreCreate() {
    preCreateAttempt = null
  },
  getRecovery: readRecovery,
  saveBooking(booking, userId, returnUrl) {
    return writeRecovery({
      bookingId: booking.id,
      bookingNumber: booking.bookingNumber,
      holdExpiresAt: booking.holdExpiresAt,
      carId: booking.carId,
      userId,
      returnUrl,
    })
  },
  savePayment(paymentId) {
    const current = readRecovery()
    return current ? writeRecovery({ ...current, paymentId }) : null
  },
  clearRecovery() {
    window.sessionStorage.removeItem(RECOVERY_KEY)
  },
  clearAll() {
    preCreateAttempt = null
    window.sessionStorage.removeItem(RECOVERY_KEY)
  },
}
export default bookingAttemptSession
