import PropTypes from 'prop-types'
import { Box, Typography, Divider } from '@mui/material'
import { formatCurrency } from '@/utils/formatters'
import { formatDate } from '@/utils/date'

/**
 * Compact booking summary used in checkout and confirmation.
 */
function BookingSummary({ car, startDate, endDate, total }) {
  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Booking Summary
      </Typography>
      <Typography variant="h6">
        {car?.brand} {car?.model}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {car?.year} • {car?.location}
      </Typography>

      <Divider sx={{ my: 1.5 }} />

      <Row label="Pickup" value={startDate ? formatDate(startDate) : '—'} />
      <Row label="Return" value={endDate ? formatDate(endDate) : '—'} />
      <Row
        label="Rate"
        value={car?.pricePerDay ? `${formatCurrency(car.pricePerDay)} / day` : '—'}
      />

      <Divider sx={{ my: 1.5 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Typography variant="subtitle1">Total</Typography>
        <Typography variant="h6" color="primary">
          {formatCurrency(total)}
        </Typography>
      </Box>
    </Box>
  )
}

function Row({ label, value }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Box>
  )
}

Row.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
}

BookingSummary.propTypes = {
  car: PropTypes.object,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  total: PropTypes.number,
}

export default BookingSummary
