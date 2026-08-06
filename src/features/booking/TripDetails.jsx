import { memo } from 'react'
import PropTypes from 'prop-types'
import { Box, Typography } from '@mui/material'
import { formatDate } from '@/utils/date'

/**
 * Displays the trip date range and locations.
 */
function TripDetails({ trip }) {
  if (!trip) return null

  return (
    <Box aria-label="Trip details">
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Trip
      </Typography>
      <Typography variant="body2">
        {trip.pickupDate ? formatDate(trip.pickupDate) : '—'} →{' '}
        {trip.dropDate ? formatDate(trip.dropDate) : '—'}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {trip.pickupLocation || 'Pickup'} → {trip.dropLocation || 'Drop'}
      </Typography>
    </Box>
  )
}

TripDetails.propTypes = {
  trip: PropTypes.shape({
    pickupDate: PropTypes.string,
    dropDate: PropTypes.string,
    pickupLocation: PropTypes.string,
    dropLocation: PropTypes.string,
  }),
}

export default memo(TripDetails)
