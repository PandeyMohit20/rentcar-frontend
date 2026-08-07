import { useApiQuery, useApiMutation } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { referralService } from '@/services/modules'

/**
 * Referral feature hooks.
 */
export function useReferralDetails() {
  return useApiQuery({
    queryKey: QUERY_KEYS.REFERRAL.DETAILS,
    queryFn: referralService.getReferralDetails,
  })
}

export function useSendInvite() {
  return useApiMutation({
    mutationFn: referralService.sendInvite,
    invalidateKeys: [QUERY_KEYS.REFERRAL.DETAILS],
  })
}
