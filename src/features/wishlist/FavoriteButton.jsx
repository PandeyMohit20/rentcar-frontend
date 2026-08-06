import PropTypes from 'prop-types'
import { IconButton, Tooltip, CircularProgress } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { useState } from 'react'
import { useWishlist } from './useWishlist'

/**
 * Circular favorite toggle button with accessibility labels.
 */
function FavoriteButton({ carId, size = 'default', sx }) {
  const { isWishlisted, toggle } = useWishlist()
  const [busy, setBusy] = useState(false)
  const active = isWishlisted(carId)

  const handleClick = async (e) => {
    e.stopPropagation()
    e.preventDefault()
    setBusy(true)
    await toggle(carId)
    setBusy(false)
  }

  return (
    <Tooltip title={active ? 'Remove from wishlist' : 'Add to wishlist'}>
      <IconButton
        size={size}
        onClick={handleClick}
        aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
        aria-pressed={active}
        disabled={busy}
        sx={sx}
      >
        {busy ? (
          <CircularProgress size={18} />
        ) : active ? (
          <FavoriteIcon color="error" />
        ) : (
          <FavoriteBorderIcon />
        )}
      </IconButton>
    </Tooltip>
  )
}

FavoriteButton.propTypes = {
  carId: PropTypes.string.isRequired,
  size: PropTypes.string,
  sx: PropTypes.object,
}

export default FavoriteButton
