import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { AccountPageShell, WishlistCard } from '@/components/account'
import { useAccountWishlist, useRemoveFromWishlist } from '@/features/wishlist'
import { useToast } from '@/contexts/ToastContext'
import EmptyState from '@/components/common/EmptyState'
import { ROUTES } from '@/constants/routes'

/**
 * Account Wishlist page — saved cars.
 */
function AccountWishlistPage() {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const { data } = useAccountWishlist()
  const removeFromWishlist = useRemoveFromWishlist()

  const items = useMemo(() => data ?? [], [data])

  const handleRemove = async (item) => {
    const carId = item.car?.id ?? item.id ?? item.carId
    try {
      await removeFromWishlist.mutateAsync(carId)
      showSuccess('Removed from wishlist.')
    } catch (error) {
      showError(error?.message || 'Failed to remove from wishlist.')
    }
  }

  return (
    <AccountPageShell title="My Wishlist" description="Cars you've saved for later.">
      {items.length === 0 && (
        <EmptyState
          icon={FavoriteIcon}
          title="Wishlist is empty"
          description="Browse cars and tap the heart to save them here."
          actionLabel="Browse Cars"
          onAction={() => navigate(ROUTES.SEARCH)}
        />
      )}
      <Box>
        {items.map((item) => (
          <WishlistCard key={item.car?.id ?? item.id} item={item} onRemove={handleRemove} />
        ))}
      </Box>
    </AccountPageShell>
  )
}

export default AccountWishlistPage
