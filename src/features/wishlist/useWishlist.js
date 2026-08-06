import { useCallback, useMemo } from 'react'
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux'
import {
  addToWishlist,
  removeFromWishlist,
  toggleWishlistFailure,
} from '@/redux/slices/wishlistSlice'
import { wishlistService } from '@/services/modules'
import { useToast } from '@/contexts/ToastContext'

/**
 * Wishlist hook wrapping Redux state + placeholder API calls.
 */
export function useWishlist() {
  const dispatch = useAppDispatch()
  const { showSuccess, showError } = useToast()
  const carIds = useAppSelector((state) => state.wishlist.carIds)

  const isWishlisted = useCallback((carId) => carIds.includes(carId), [carIds])

  const add = useCallback(
    async (carId) => {
      try {
        await wishlistService.addToWishlist(carId)
        dispatch(addToWishlist(carId))
        showSuccess('Added to wishlist.')
      } catch (error) {
        dispatch(toggleWishlistFailure(error?.message || 'Failed to add to wishlist.'))
        showError(error?.message || 'Failed to add to wishlist.')
      }
    },
    [dispatch, showSuccess, showError]
  )

  const remove = useCallback(
    async (carId) => {
      try {
        await wishlistService.removeFromWishlist(carId)
        dispatch(removeFromWishlist(carId))
        showSuccess('Removed from wishlist.')
      } catch (error) {
        dispatch(toggleWishlistFailure(error?.message || 'Failed to remove from wishlist.'))
        showError(error?.message || 'Failed to remove from wishlist.')
      }
    },
    [dispatch, showSuccess, showError]
  )

  const toggle = useCallback(
    (carId) => {
      if (isWishlisted(carId)) return remove(carId)
      return add(carId)
    },
    [isWishlisted, add, remove]
  )

  return useMemo(
    () => ({ carIds, isWishlisted, add, remove, toggle }),
    [carIds, isWishlisted, add, remove, toggle]
  )
}

export default useWishlist
