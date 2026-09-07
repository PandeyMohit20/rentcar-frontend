import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { addressService } from '@/services/modules/addressService'
import { useAccountMutation } from '@/features/account/useAccountMutation'

export function useSavedAddresses() {
  return useQuery({ queryKey: QUERY_KEYS.ADDRESSES.ALL, queryFn: addressService.listAddresses })
}
export function useAddAddress() {
  return useAccountMutation(addressService.createAddress, [QUERY_KEYS.ADDRESSES.ALL])
}
export function useUpdateAddress() {
  return useAccountMutation(
    ({ id, ...payload }) => addressService.updateAddress(id, payload),
    [QUERY_KEYS.ADDRESSES.ALL]
  )
}
export function useDeleteAddress() {
  return useAccountMutation(addressService.deleteAddress, [QUERY_KEYS.ADDRESSES.ALL])
}
