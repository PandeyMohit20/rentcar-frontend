import { useApiQuery, useApiMutation } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { profileService } from '@/services/modules'

/**
 * Profile feature hooks.
 */
export function useProfile() {
  return useApiQuery({
    queryKey: QUERY_KEYS.PROFILE.DETAILS,
    queryFn: profileService.getProfile,
  })
}

export function useEmergencyContact() {
  return useApiQuery({
    queryKey: QUERY_KEYS.PROFILE.EMERGENCY_CONTACT,
    queryFn: profileService.getEmergencyContact,
  })
}

export function useProfileCompletion() {
  return useApiQuery({
    queryKey: QUERY_KEYS.PROFILE.COMPLETION,
    queryFn: profileService.getProfileCompletion,
  })
}

export function useUpdateProfile() {
  return useApiMutation({
    mutationFn: profileService.updateProfile,
    invalidateKeys: [QUERY_KEYS.PROFILE.DETAILS, QUERY_KEYS.PROFILE.COMPLETION],
  })
}

export function useUpdateEmergencyContact() {
  return useApiMutation({
    mutationFn: profileService.updateEmergencyContact,
    invalidateKeys: [QUERY_KEYS.PROFILE.EMERGENCY_CONTACT],
  })
}
