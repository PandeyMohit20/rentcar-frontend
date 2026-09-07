import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { kycService } from '@/services/modules/kycService'
import { useAccountMutation } from '@/features/account/useAccountMutation'

const keys = [QUERY_KEYS.KYC.STATUS, QUERY_KEYS.KYC.DOCUMENTS, QUERY_KEYS.PROFILE.DETAILS]
export function useKycStatus() {
  return useQuery({
    queryKey: QUERY_KEYS.KYC.STATUS,
    queryFn: kycService.getStatus,
    refetchOnWindowFocus: true,
  })
}
export function useKycDocuments() {
  return useQuery({
    queryKey: QUERY_KEYS.KYC.DOCUMENTS,
    queryFn: kycService.listDocuments,
    refetchOnWindowFocus: true,
  })
}
export function useDeleteKycDocument() {
  return useAccountMutation(kycService.deleteDocument, keys)
}
export function useSubmitKyc() {
  return useAccountMutation(kycService.submitKyc, keys)
}
export function useUploadKycDocument() {
  return useAccountMutation(kycService.uploadDocument, keys)
}
