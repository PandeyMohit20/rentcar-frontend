import { useCallback, useEffect, useState } from 'react'
import storage from '@/utils/storage'

const STORAGE_KEY = 'rentcar_recent_searches'
const MAX_ITEMS = 6

/**
 * LocalStorage-backed recent search history.
 * Provides add/remove/clear helpers without business logic.
 */
export function useSearchHistory() {
  const [searches, setSearches] = useState(() => storage.get(STORAGE_KEY, []))

  useEffect(() => {
    storage.set(STORAGE_KEY, searches)
  }, [searches])

  const addSearch = useCallback((entry) => {
    if (!entry || !entry.location) return
    setSearches((prev) => {
      const rest = prev.filter(
        (item) => !(item.location === entry.location && item.pickupDate === entry.pickupDate)
      )
      return [entry, ...rest].slice(0, MAX_ITEMS)
    })
  }, [])

  const removeSearch = useCallback((id) => {
    setSearches((prev) => prev.filter((_, i) => i !== id))
  }, [])

  const clearHistory = useCallback(() => {
    setSearches([])
  }, [])

  return { searches, addSearch, removeSearch, clearHistory }
}

export default useSearchHistory
