const RECOVERY_KEY = 'rentcar_booking_recovery'
const ATTEMPT_KEY = 'rentcar_booking_attempt'
let preCreateAttempt = null
let memoryRecovery = null
const readAttempt = () => { try { return JSON.parse(window.sessionStorage.getItem(ATTEMPT_KEY)) } catch { return null } }

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
    return JSON.parse(window.sessionStorage.getItem(RECOVERY_KEY)) || memoryRecovery
  } catch {
    return memoryRecovery
  }
}

const writeRecovery = (value) => {
  memoryRecovery = value
  try { window.sessionStorage.setItem(RECOVERY_KEY, JSON.stringify(value)) } catch { /* Memory recovery still works for this tab. */ }
  return value
}

export const bookingAttemptSession = {
  getOrCreateKey(contextKey) {
    preCreateAttempt ||= readAttempt()
    if (!preCreateAttempt || preCreateAttempt.contextKey !== contextKey) {
      preCreateAttempt = { contextKey, idempotencyKey: createUuid() }
      try { window.sessionStorage.setItem(ATTEMPT_KEY, JSON.stringify(preCreateAttempt)) } catch { /* Keep the key stable in memory. */ }
    }
    return preCreateAttempt.idempotencyKey
  },
  clearPreCreate() {
    preCreateAttempt = null
    try { window.sessionStorage.removeItem(ATTEMPT_KEY) } catch { /* Storage unavailable. */ }
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
    memoryRecovery = null
    try { window.sessionStorage.removeItem(RECOVERY_KEY) } catch { /* Storage unavailable. */ }
  },
  clearAll() {
    preCreateAttempt = null
    try { window.sessionStorage.removeItem(ATTEMPT_KEY) } catch { /* Storage unavailable. */ }
    memoryRecovery = null
    try { window.sessionStorage.removeItem(RECOVERY_KEY) } catch { /* Storage unavailable. */ }
  },
}
export default bookingAttemptSession
