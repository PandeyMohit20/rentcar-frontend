import { memo } from 'react'
import PropTypes from 'prop-types'
import { Box, Divider, Typography } from '@mui/material'
import { formatCurrency } from '@/utils/formatters'

/**
 * Trip summary card.
 */
function TripSummary({ trip }) {
  if (!trip) return null

  return (
    <Box aria-label="Trip summary">
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Trip Details
      </Typography>
      <Typography variant="body2" gutterBottom>
        Car: {trip.car ? `${trip.car.brand} ${trip.car.model}` : '—'}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Pickup: {trip.pickupLocation || '—'}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Drop: {trip.dropLocation || '—'}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Duration: {trip.durationDays ?? '—'} days
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Distance: {trip.distanceKm ?? 'Estimate pending'} km
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Fuel: {trip.estimatedFuel ?? 'Estimate pending'}
      </Typography>
      <Divider sx={{ my: 1.5 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body1" fontWeight={600}>
          Trip Cost
        </Typography>
        <Typography variant="body1" fontWeight={600} color="primary">
          {formatCurrency(trip.tripCost)}
        </Typography>
      </Box>
    </Box>
  )
}

TripSummary.propTypes = {
  trip: PropTypes.shape({
    car: PropTypes.shape({ brand: PropTypes.string, model: PropTypes.string }),
    pickupLocation: PropTypes.string,
    dropLocation: PropTypes.string,
    durationDays: PropTypes.number,
    distanceKm: PropTypes.number,
    estimatedFuel: PropTypes.string,
    tripCost: PropTypes.number,
  }),
}

export default memo(TripSummary)
