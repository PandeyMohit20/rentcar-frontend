import { useApiQuery, useApiMutation } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { kycService } from '@/services/modules'

/**
 * KYC feature hooks.
 */
export function useKycStatus() {
  return useApiQuery({
    queryKey: QUERY_KEYS.KYC.STATUS,
    queryFn: kycService.getStatus,
  })
}

export function useSubmitKycDocument() {
  return useApiMutation({
    mutationFn: ({ type, ...payload }) => kycService.submitDocument(type, payload),
    invalidateKeys: [QUERY_KEYS.KYC.STATUS],
  })
}

export function useResubmitKycDocument() {
  return useApiMutation({
    mutationFn: ({ type, ...payload }) => kycService.resubmitDocument(type, payload),
    invalidateKeys: [QUERY_KEYS.KYC.STATUS],
  })
}
