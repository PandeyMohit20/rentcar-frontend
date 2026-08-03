import PropTypes from 'prop-types'
import { Box, Typography, Chip, Rating, CardActions } from '@mui/material'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import MaterialCard from '@/components/ui/MaterialCard'
import PrimaryButton from '@/components/buttons/PrimaryButton'
import { formatCurrency } from '@/utils/formatters'
import { ROUTES } from '@/constants/routes'

/**
 * Card displaying a car summary in lists/search results.
 */
function CarCard({ car }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <MaterialCard>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            {car.brand} {car.model}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {car.fuelType} • {car.transmission} • Seats {car.seatingCapacity}
          </Typography>
          <Rating value={car.rating} readOnly size="small" />
          <Box sx={{ mt: 1 }}>
            {car.isAvailable ? (
              <Chip label="Available" color="success" size="small" />
            ) : (
              <Chip label="Unavailable" color="error" size="small" />
            )}
          </Box>
        </Box>
        <CardActions sx={{ px: 2, pb: 2 }}>
          <Typography variant="h6" color="primary">
            {formatCurrency(car.pricePerDay)}
            <Typography component="span" variant="caption" color="text.secondary">
              {' '}
              / day
            </Typography>
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <PrimaryButton component={Link} to={ROUTES.CAR_DETAILS_WITH_ID(car.id)}>
            View
          </PrimaryButton>
        </CardActions>
      </MaterialCard>
    </motion.div>
  )
}

CarCard.propTypes = {
  car: PropTypes.shape({
    id: PropTypes.string.isRequired,
    brand: PropTypes.string,
    model: PropTypes.string,
    fuelType: PropTypes.string,
    transmission: PropTypes.string,
    seatingCapacity: PropTypes.number,
    rating: PropTypes.number,
    pricePerDay: PropTypes.number,
    isAvailable: PropTypes.bool,
  }).isRequired,
}

export default CarCard
