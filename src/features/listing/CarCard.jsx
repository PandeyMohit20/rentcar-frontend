import PropTypes from 'prop-types'
import { Box, Typography, Chip, Rating, Stack, CardActions, CardContent } from '@mui/material'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'
import SettingsIcon from '@mui/icons-material/Settings'
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal'
import MaterialCard from '@/components/ui/MaterialCard'
import ImageLazy from '@/components/common/ImageLazy'
import PrimaryButton from '@/components/buttons/PrimaryButton'
import FavoriteButton from '@/features/wishlist/FavoriteButton'
import CompareButton from '@/features/comparison/CompareButton'
import { formatCurrency } from '@/utils/formatters'
import { ROUTES } from '@/constants/routes'

/**
 * Rich car listing card with image, specs, price, discount,
 * wishlist/compare controls and booking CTAs.
 */
function CarCard({ car }) {
  const discount = car.discountPercent || car.discount
  const image = car.images?.[0] || car.image

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <MaterialCard>
        <Box sx={{ position: 'relative' }}>
          <ImageLazy src={image} alt={`${car.brand} ${car.model}`} ratio="16/10" />
          {discount ? (
            <Chip
              label={`${discount}% OFF`}
              color="error"
              size="small"
              sx={{ position: 'absolute', top: 8, left: 8 }}
            />
          ) : null}
          <Box
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              bgcolor: 'rgba(255,255,255,0.9)',
              borderRadius: 2,
            }}
          >
            <FavoriteButton carId={car.id} size="small" />
          </Box>
        </Box>

        <CardContent sx={{ pb: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h6" component="div">
                {car.brand} {car.model}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {car.year} • {car.fuelType} • Seats {car.seatingCapacity}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Rating value={car.rating ?? 0} readOnly size="small" />
              <Typography variant="caption" display="block" color="text.secondary">
                {car.reviewCount ?? 0} reviews
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mt: 1, color: 'text.secondary' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocalGasStationIcon fontSize="small" />
              <Typography variant="caption">{car.fuelType}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <SettingsIcon fontSize="small" />
              <Typography variant="caption">{car.transmission}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AirlineSeatReclineNormalIcon fontSize="small" />
              <Typography variant="caption">{car.seatingCapacity} seats</Typography>
            </Box>
          </Stack>
        </CardContent>

        <CardActions sx={{ px: 2, pb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" color="primary">
              {formatCurrency(car.pricePerDay)}
              <Typography component="span" variant="caption" color="text.secondary">
                {' '}
                / day
              </Typography>
            </Typography>
          </Box>
          <CompareButton carId={car.id} label={`${car.brand} ${car.model}`} size="small" />
        </CardActions>

        <CardActions sx={{ px: 2, pb: 2 }}>
          <PrimaryButton
            component={Link}
            to={ROUTES.CAR_DETAILS_WITH_ID(car.id)}
            fullWidth
            size="small"
          >
            View Details
          </PrimaryButton>
          <PrimaryButton
            component={Link}
            to={ROUTES.BOOKING_WITH_CAR(car.id)}
            fullWidth
            size="small"
            color="secondary"
            disabled={!car.isAvailable}
          >
            Book Now
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
    year: PropTypes.number,
    image: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    fuelType: PropTypes.string,
    transmission: PropTypes.string,
    seatingCapacity: PropTypes.number,
    rating: PropTypes.number,
    reviewCount: PropTypes.number,
    pricePerDay: PropTypes.number,
    discount: PropTypes.number,
    discountPercent: PropTypes.number,
    isAvailable: PropTypes.bool,
  }).isRequired,
}

export default CarCard
