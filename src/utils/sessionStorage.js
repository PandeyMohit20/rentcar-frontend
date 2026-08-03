/**
 * Safe sessionStorage wrapper with JSON serialization and error handling.
 */
const sessionStorageUtil = {
  get(key, fallback = null) {
    try {
      const value = window.sessionStorage.getItem(key)
      return value ? JSON.parse(value) : fallback
    } catch (error) {
      console.warn(`[session.get] Failed to read "${key}"`, error)
      return fallback
    }
  },

  set(key, value) {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(`[session.set] Failed to write "${key}"`, error)
    }
  },

  remove(key) {
    try {
      window.sessionStorage.removeItem(key)
    } catch (error) {
      console.warn(`[session.remove] Failed to remove "${key}"`, error)
    }
  },

  clear() {
    try {
      window.sessionStorage.clear()
    } catch (error) {
      console.warn('[session.clear] Failed to clear storage', error)
    }
  },
}

export default sessionStorageUtil
