import { memo } from 'react'
import PropTypes from 'prop-types'
import { Box, Divider, Typography } from '@mui/material'
import { formatCurrency } from '@/utils/formatters'

/**
 * Checkout booking summary card.
 */
function BookingSummary({ booking }) {
  if (!booking) {
    return (
      <Box aria-label="Booking summary">
        <Typography variant="body2" color="text.secondary">
          No booking draft found.
        </Typography>
      </Box>
    )
  }

  return (
    <Box aria-label="Booking summary">
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Booking
      </Typography>
      <Typography variant="body2" gutterBottom>
        Booking ID: {booking.id ?? '—'}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Car: {booking.car ? `${booking.car.brand} ${booking.car.model}` : '—'}
      </Typography>
      <Divider sx={{ my: 1.5 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2">Total</Typography>
        <Typography variant="body2" fontWeight={600}>
          {formatCurrency(booking.totalAmount)}
        </Typography>
      </Box>
    </Box>
  )
}

BookingSummary.propTypes = {
  booking: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    car: PropTypes.shape({
      brand: PropTypes.string,
      model: PropTypes.string,
    }),
    totalAmount: PropTypes.number,
  }),
}

export default memo(BookingSummary)
