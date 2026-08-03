import { useAppSelector } from './useRedux'
import { useMemo } from 'react'

/**
 * Hook exposing authentication state derived from the auth slice.
 */
export function useAuth() {
  const { user, token, isAuthenticated, isLoading } = useAppSelector((state) => state.auth)

  return useMemo(
    () => ({ user, token, isAuthenticated, isLoading }),
    [user, token, isAuthenticated, isLoading]
  )
}

export default useAuth
