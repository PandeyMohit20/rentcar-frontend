import { useAppSelector } from './useRedux'
import { useMemo } from 'react'

/**
 * Hook exposing authentication state derived from the auth slice.
 */
export function useAuth() {
  const { user, isAuthenticated, isLoading, isRestoring } = useAppSelector((state) => state.auth)

  return useMemo(
    () => ({ user, isAuthenticated, isLoading, isRestoring }),
    [user, isAuthenticated, isLoading, isRestoring]
  )
}

export default useAuth
