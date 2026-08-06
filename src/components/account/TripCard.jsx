import PropTypes from 'prop-types'
import { Box, Typography, Chip } from '@mui/material'
import MaterialCard from '@/components/ui/MaterialCard'
import { formatCurrency, formatDate } from '@/utils/formatters'

/**
 * Trip summary card.
 */
function TripCard({ trip = {}, onClick }) {
  return (
    <MaterialCard sx={{ p: 3, mb: 2, cursor: 'pointer' }} onClick={onClick} hoverable>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="subtitle1">
            {trip.car ? `${trip.car.brand} ${trip.car.model}` : 'Trip'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatDate(trip.startDate)} → {formatDate(trip.endDate)}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="h6" color="primary">
            {formatCurrency(trip.totalCost)}
          </Typography>
          <Chip label={trip.status} size="small" />
        </Box>
      </Box>
    </MaterialCard>
  )
}

TripCard.propTypes = {
  trip: PropTypes.object,
  onClick: PropTypes.func,
}

export default TripCard
