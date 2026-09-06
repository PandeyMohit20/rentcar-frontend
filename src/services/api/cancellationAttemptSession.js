const STORAGE_KEY = 'rentcar_cancellation_attempt'

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
    return JSON.parse(window.sessionStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

export const cancellationAttemptSession = {
  getOrCreateKey(bookingId) {
    const current = read()
    if (current?.bookingId === bookingId && current.idempotencyKey) {
      return current.idempotencyKey
    }
    const next = { bookingId, idempotencyKey: createUuid() }
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    return next.idempotencyKey
  },
  clear(bookingId) {
    const current = read()
    if (!bookingId || current?.bookingId === bookingId) {
      window.sessionStorage.removeItem(STORAGE_KEY)
    }
  },
}

export default cancellationAttemptSession
