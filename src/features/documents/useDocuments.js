import { useApiQuery, useApiMutation } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { documentService } from '@/services/modules'

/**
 * Documents feature hooks.
 */
export function useDocuments() {
  return useApiQuery({
    queryKey: QUERY_KEYS.DOCUMENTS.ALL,
    queryFn: documentService.listDocuments,
  })
}

export function useUploadDocument() {
  return useApiMutation({
    mutationFn: documentService.uploadDocument,
    invalidateKeys: [QUERY_KEYS.DOCUMENTS.ALL],
  })
}

export function useDeleteDocument() {
  return useApiMutation({
    mutationFn: documentService.deleteDocument,
    invalidateKeys: [QUERY_KEYS.DOCUMENTS.ALL],
  })
}
