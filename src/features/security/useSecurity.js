import { useApiQuery, useApiMutation } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { securityService } from '@/services/modules'

/**
 * Security feature hooks.
 */
export function useChangePassword() {
  return useApiMutation({
    mutationFn: securityService.changePassword,
  })
}

export function useTwoFactorStatus() {
  return useApiQuery({
    queryKey: QUERY_KEYS.SECURITY.TWO_FACTOR,
    queryFn: securityService.getTwoFactorStatus,
  })
}

export function useEnableTwoFactor() {
  return useApiMutation({
    mutationFn: securityService.enableTwoFactor,
    invalidateKeys: [QUERY_KEYS.SECURITY.TWO_FACTOR],
  })
}

export function useDisableTwoFactor() {
  return useApiMutation({
    mutationFn: securityService.disableTwoFactor,
    invalidateKeys: [QUERY_KEYS.SECURITY.TWO_FACTOR],
  })
}

export function useLoginHistory() {
  return useApiQuery({
    queryKey: QUERY_KEYS.SECURITY.LOGIN_HISTORY,
    queryFn: securityService.getLoginHistory,
  })
}

export function useActiveSessions() {
  return useApiQuery({
    queryKey: QUERY_KEYS.SECURITY.SESSIONS,
    queryFn: securityService.getActiveSessions,
  })
}

export function useRevokeSession() {
  return useApiMutation({
    mutationFn: securityService.revokeSession,
    invalidateKeys: [QUERY_KEYS.SECURITY.SESSIONS],
  })
}

export function useTrustedDevices() {
  return useApiQuery({
    queryKey: QUERY_KEYS.SECURITY.DEVICES,
    queryFn: securityService.getTrustedDevices,
  })
}

export function useRevokeDevice() {
  return useApiMutation({
    mutationFn: securityService.revokeDevice,
    invalidateKeys: [QUERY_KEYS.SECURITY.DEVICES],
  })
}
