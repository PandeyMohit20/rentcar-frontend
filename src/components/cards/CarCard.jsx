import PropTypes from 'prop-types'
import { Box, Typography, Chip, CardActions } from '@mui/material'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import MaterialCard from '@/components/ui/MaterialCard'
import PrimaryButton from '@/components/buttons/PrimaryButton'
import { formatCurrency } from '@/utils/formatters'
import { ROUTES } from '@/constants/routes'
import ImageLazy from '@/components/common/ImageLazy'

/**
 * Card displaying a car summary in lists/search results.
 */
function CarCard({ car, to }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <MaterialCard>
        <ImageLazy
          src={car.primaryImageUrl || '/placeholder-car.svg'}
          alt={`${car.brand} ${car.model}`}
          ratio="16/10"
        />
        <Box sx={{ p: 2 }}>
          <Typography component="h3" variant="h6" gutterBottom sx={{ overflowWrap: 'anywhere' }}>
            {car.brand} {car.model}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {[
              car.year,
              car.fuelType,
              car.transmission,
              car.seatingCapacity ? `${car.seatingCapacity} seats` : null,
            ]
              .filter(Boolean)
              .join(' · ')}
          </Typography>
          <Box sx={{ mt: 1 }}>
            {car.branch?.name && (
              <Chip label={car.branch.name} color="primary" size="small" variant="outlined" />
            )}
          </Box>
        </Box>
        <CardActions sx={{ px: 2, pb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h6" color="primary">
            {car.dailyPrice == null ? (
              <Typography component="span" variant="body2" color="text.secondary">
                Get a trusted quote
              </Typography>
            ) : (
              <>
                {formatCurrency(car.dailyPrice, car.currencyCode)}
                <Typography component="span" variant="caption" color="text.secondary">
                  {' '}
                  / day
                </Typography>
              </>
            )}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <PrimaryButton component={Link} to={to || ROUTES.CAR_DETAILS_WITH_ID(car.id)}>
            View Car
          </PrimaryButton>
        </CardActions>
      </MaterialCard>
    </motion.div>
  )
}

CarCard.propTypes = {
  to: PropTypes.string,
  car: PropTypes.shape({
    id: PropTypes.string.isRequired,
    brand: PropTypes.string,
    model: PropTypes.string,
    year: PropTypes.number,
    fuelType: PropTypes.string,
    transmission: PropTypes.string,
    seatingCapacity: PropTypes.number,
    dailyPrice: PropTypes.number,
    currencyCode: PropTypes.string,
    primaryImageUrl: PropTypes.string,
    branch: PropTypes.shape({ name: PropTypes.string }),
  }).isRequired,
}

export default CarCard
