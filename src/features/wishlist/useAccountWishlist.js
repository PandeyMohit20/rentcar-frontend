import { useApiQuery, useApiMutation } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { wishlistService } from '@/services/modules'

/**
 * Account wishlist feature hooks.
 */
export function useAccountWishlist() {
  return useApiQuery({
    queryKey: QUERY_KEYS.WISHLIST.ALL,
    queryFn: wishlistService.listWishlist,
  })
}

export function useRemoveFromWishlist() {
  return useApiMutation({
    mutationFn: wishlistService.removeFromWishlist,
    invalidateKeys: [QUERY_KEYS.WISHLIST.ALL],
  })
}
