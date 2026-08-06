import PropTypes from 'prop-types'
import { Typography, Rating, Box, Chip } from '@mui/material'

/**
 * Car summary: title, rating, key badges and description.
 */
function CarOverview({ car }) {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {car.brand} {car.model}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {car.year} • {car.location}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Rating value={car.rating ?? 0} readOnly size="small" />
        <Typography variant="body2" color="text.secondary">
          {car.reviewCount ?? 0} reviews
        </Typography>
        {car.isAvailable ? (
          <Chip label="Available" color="success" size="small" />
        ) : (
          <Chip label="Unavailable" color="error" size="small" />
        )}
      </Box>
      <Typography variant="body1" color="text.secondary">
        {car.description}
      </Typography>
    </Box>
  )
}

CarOverview.propTypes = {
  car: PropTypes.object.isRequired,
}

export default CarOverview
