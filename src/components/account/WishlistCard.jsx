import PropTypes from 'prop-types'
import { Box, Typography, IconButton } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import MaterialCard from '@/components/ui/MaterialCard'
import { formatCurrency } from '@/utils/formatters'

/**
 * Wishlist item card.
 */
function WishlistCard({ item = {}, onRemove }) {
  const car = item.car ?? item
  return (
    <MaterialCard sx={{ display: 'flex', alignItems: 'center', p: 2, mb: 2 }} hoverable>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1">
          {car.brand} {car.model}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {formatCurrency(car.pricePerDay)} / day
        </Typography>
      </Box>
      <IconButton aria-label="Remove from wishlist" color="error" onClick={() => onRemove?.(item)}>
        <FavoriteIcon />
      </IconButton>
    </MaterialCard>
  )
}

WishlistCard.propTypes = {
  item: PropTypes.object,
  onRemove: PropTypes.func,
}

export default WishlistCard
