/**
 * Safe localStorage wrapper with JSON serialization and error handling.
 */
const storage = {
  get(key, fallback = null) {
    try {
      const value = window.localStorage.getItem(key)
      return value ? JSON.parse(value) : fallback
    } catch (error) {
      console.warn(`[storage.get] Failed to read "${key}"`, error)
      return fallback
    }
  },

  set(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(`[storage.set] Failed to write "${key}"`, error)
    }
  },

  remove(key) {
    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      console.warn(`[storage.remove] Failed to remove "${key}"`, error)
    }
  },

  clear() {
    try {
      window.localStorage.clear()
    } catch (error) {
      console.warn('[storage.clear] Failed to clear storage', error)
    }
  },
}

export default storage
