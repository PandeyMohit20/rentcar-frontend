import { memo } from 'react'
import PropTypes from 'prop-types'
import { Box, Chip, Divider, Typography } from '@mui/material'
import { formatDate } from '@/utils/date'

/**
 * Booking confirmation summary.
 */
function BookingConfirmation({ booking }) {
  if (!booking) return null

  return (
    <Box aria-label="Booking confirmation">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Booking Confirmed</Typography>
        <Chip label={booking.status ?? 'confirmed'} color="success" size="small" />
      </Box>
      <Typography variant="body2" gutterBottom>
        Booking ID: {booking.id ?? '—'}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Payment: {booking.paymentStatus ?? '—'}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body2" gutterBottom>
        {booking.car ? `${booking.car.brand} ${booking.car.model}` : 'Car'}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {booking.startDate ? formatDate(booking.startDate) : '—'} →{' '}
        {booking.endDate ? formatDate(booking.endDate) : '—'}
      </Typography>
    </Box>
  )
}

BookingConfirmation.propTypes = {
  booking: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.string,
    paymentStatus: PropTypes.string,
    car: PropTypes.shape({ brand: PropTypes.string, model: PropTypes.string }),
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }),
}

export default memo(BookingConfirmation)
