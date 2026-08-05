/**
 * Reliable redux-persist storage adapter.
 *
 * redux-persist's built-in `redux-persist/lib/storage` relies on detecting
 * the native storage via the `self` global, which is unreliable inside
 * Vite's ESM module scope and can cause `storage.getItem/setItem is not a
 * function` errors — crashing the app on a white screen.
 *
 * This adapter directly uses `window.*Storage` and exposes the exact
 * `{ getItem, setItem, removeItem }` interface redux-persist expects,
 * with each method returning a Promise.
 */

/**
 * Create a redux-persist storage adapter backed by a native Web Storage API.
 * @param {Storage} storage - e.g. window.localStorage or window.sessionStorage
 * @returns {{ getItem: Function, setItem: Function, removeItem: Function }}
 */
function createReduxPersistStorage(storage) {
  return {
    getItem: (key) => {
      try {
        return Promise.resolve(storage.getItem(key))
      } catch (error) {
        console.warn(`[reduxPersistStorage.getItem] Failed to read "${key}"`, error)
        return Promise.resolve(null)
      }
    },
    setItem: (key, item) => {
      try {
        storage.setItem(key, item)
        return Promise.resolve()
      } catch (error) {
        console.warn(`[reduxPersistStorage.setItem] Failed to write "${key}"`, error)
        return Promise.resolve()
      }
    },
    removeItem: (key) => {
      try {
        storage.removeItem(key)
        return Promise.resolve()
      } catch (error) {
        console.warn(`[reduxPersistStorage.removeItem] Failed to remove "${key}"`, error)
        return Promise.resolve()
      }
    },
  }
}

/**
 * localStorage-backed storage adapter for redux-persist.
 */
export const storage = createReduxPersistStorage(
  typeof window !== 'undefined' ? window.localStorage : null
)

/**
 * sessionStorage-backed storage adapter for redux-persist.
 */
export const sessionStorage = createReduxPersistStorage(
  typeof window !== 'undefined' ? window.sessionStorage : null
)

export default storage
