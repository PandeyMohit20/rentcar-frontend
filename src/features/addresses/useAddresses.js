import { useApiQuery, useApiMutation } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { addressService } from '@/services/modules'

/**
 * Saved addresses feature hooks.
 */
export function useSavedAddresses() {
  return useApiQuery({
    queryKey: QUERY_KEYS.ADDRESSES.ALL,
    queryFn: addressService.listAddresses,
  })
}

export function useAddAddress() {
  return useApiMutation({
    mutationFn: addressService.createAddress,
    invalidateKeys: [QUERY_KEYS.ADDRESSES.ALL],
  })
}

export function useUpdateAddress() {
  return useApiMutation({
    mutationFn: ({ id, ...payload }) => addressService.updateAddress(id, payload),
    invalidateKeys: [QUERY_KEYS.ADDRESSES.ALL],
  })
}

export function useDeleteAddress() {
  return useApiMutation({
    mutationFn: addressService.deleteAddress,
    invalidateKeys: [QUERY_KEYS.ADDRESSES.ALL],
  })
}
