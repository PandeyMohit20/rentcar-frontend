import PropTypes from 'prop-types'
import { Box, Paper, Typography, Button } from '@mui/material'
import { formatCurrency } from '@/utils/formatters'

/**
 * Fixed bottom booking bar with price and CTA.
 */
function StickyBookingCard({ price, label = 'Book Now', onBook, disabled = false }) {
  return (
    <Paper
      elevation={6}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        px: { xs: 2, sm: 3 },
        py: 1.5,
        borderRadius: 0,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, maxWidth: 1200, mx: 'auto' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="caption" display="block" color="text.secondary">
            Total
          </Typography>
          <Typography variant="h6" color="primary">
            {formatCurrency(price)}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={onBook}
          disabled={disabled}
        >
          {label}
        </Button>
      </Box>
    </Paper>
  )
}

StickyBookingCard.propTypes = {
  price: PropTypes.number,
  label: PropTypes.string,
  onBook: PropTypes.func,
  disabled: PropTypes.bool,
}

export default StickyBookingCard
