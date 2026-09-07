const STORAGE_KEY = 'rentcar_cancellation_attempt'
let memoryAttempt = null

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

const read = () => {
  try {
    return JSON.parse(window.sessionStorage.getItem(STORAGE_KEY)) || memoryAttempt
  } catch {
    return memoryAttempt
  }
}

export const cancellationAttemptSession = {
  getOrCreateKey(bookingId) {
    const current = read()
    if (current?.bookingId === bookingId && current.idempotencyKey) {
      return current.idempotencyKey
    }
    const next = { bookingId, idempotencyKey: createUuid() }
    memoryAttempt = next
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* Keep a stable key in memory. */
    }
    return next.idempotencyKey
  },
  clear(bookingId) {
    const current = read()
    if (!bookingId || current?.bookingId === bookingId) {
      memoryAttempt = null
      try {
        window.sessionStorage.removeItem(STORAGE_KEY)
      } catch {
        /* Storage unavailable. */
      }
    }
  },
}

export default cancellationAttemptSession
