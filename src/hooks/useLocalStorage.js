import { useState, useCallback } from 'react'

/**
 * React state backed by localStorage.
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value) => {
      try {
        const nextValue = value instanceof Function ? value(storedValue) : value
        setStoredValue(nextValue)
        window.localStorage.setItem(key, JSON.stringify(nextValue))
      } catch (error) {
        console.warn(`[useLocalStorage] Failed to write "${key}"`, error)
      }
    },
    [key, storedValue]
  )

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.warn(`[useLocalStorage] Failed to remove "${key}"`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}

export default useLocalStorage
