import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { profileService } from '@/services/modules/profileService'
import { useAccountMutation } from '@/features/account/useAccountMutation'
import { useAppDispatch } from '@/hooks/useRedux'
import { updateUser } from '@/redux/slices/authSlice'

export function useProfile() {
  return useQuery({ queryKey: QUERY_KEYS.PROFILE.DETAILS, queryFn: profileService.getProfile })
}
export function useAccountIdentity() {
  return useQuery({ queryKey: QUERY_KEYS.PROFILE.ACCOUNT, queryFn: profileService.getAccount })
}
export function useUpdateProfile() {
  return useAccountMutation(profileService.updateProfile, [QUERY_KEYS.PROFILE.DETAILS])
}
export function useUpdateAccount() {
  const dispatch = useAppDispatch()
  return useAccountMutation(
    profileService.updateAccount,
    [QUERY_KEYS.PROFILE.ACCOUNT, QUERY_KEYS.AUTH.ME],
    (user) => dispatch(updateUser(user))
  )
}
