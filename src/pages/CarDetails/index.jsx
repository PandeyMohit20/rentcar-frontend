import { useParams, Link } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  Rating,
  CircularProgress,
  Divider,
} from '@mui/material'
import Seo from '@/components/common/Seo'
import MaterialCard from '@/components/ui/MaterialCard'
import PrimaryButton from '@/components/buttons/PrimaryButton'
import EmptyState from '@/components/common/EmptyState'
import { carService } from '@/services/modules'
import { useApiQuery } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { formatCurrency } from '@/utils/formatters'
import { ROUTES } from '@/constants/routes'
import { pageStyles } from './styles'

/**
 * Car Details page — full details, features and reviews.
 */
function CarDetailsPage() {
  const { id } = useParams()

  const { data, isLoading, error } = useApiQuery({
    queryKey: QUERY_KEYS.CARS.DETAILS(id),
    queryFn: () => carService.getCarDetails(id),
    enabled: Boolean(id),
  })

  const { data: reviewsData } = useApiQuery({
    queryKey: QUERY_KEYS.CARS.REVIEWS(id),
    queryFn: () => carService.getCarReviews(id),
    enabled: Boolean(id),
  })

  const car = data?.data ?? data?.car
  const reviews = reviewsData?.data ?? reviewsData?.reviews ?? []

  if (isLoading) {
    return (
      <Box sx={{ py: 12, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !car) {
    return (
      <>
        <Seo title="Car Not Found" description="The requested car could not be found." />
        <Container maxWidth="lg" sx={pageStyles.container}>
          <EmptyState
            title="Car not found"
            description="The car you are looking for does not exist."
            actionLabel="Browse Cars"
            onAction={() => {}}
          />
        </Container>
      </>
    )
  }

  return (
    <>
      <Seo title={`${car.brand} ${car.model}`} description={car.description} />
      <Container maxWidth="lg" sx={pageStyles.container}>
        <Typography variant="h4" sx={pageStyles.title}>
          {car.brand} {car.model}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={pageStyles.subtitle}>
          {car.year} • {car.fuelType} • {car.transmission}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <MaterialCard sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Overview
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {car.description}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Features
              </Typography>
              <Box sx={pageStyles.featuresBox}>
                {(car.features ?? []).map((feature) => (
                  <Chip key={feature} label={feature} color="primary" variant="outlined" />
                ))}
              </Box>
            </MaterialCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <MaterialCard sx={{ p: 3, position: 'sticky', top: 90 }}>
              <Box sx={pageStyles.priceBox}>
                <Typography variant="h5" color="primary">
                  {formatCurrency(car.pricePerDay)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  / day
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Rating value={car.rating} readOnly />
                <Typography variant="caption" color="text.secondary">
                  {' '}
                  ({car.reviewCount ?? 0} reviews)
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Seats: {car.seatingCapacity} • Luggage: {car.luggageCapacity}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Location: {car.location}
              </Typography>
              <Box sx={{ mt: 2, mb: 2 }}>
                {car.isAvailable ? (
                  <Chip label="Available" color="success" />
                ) : (
                  <Chip label="Unavailable" color="error" />
                )}
              </Box>
              <PrimaryButton
                fullWidth
                component={Link}
                to={ROUTES.BOOKING_WITH_CAR(car.id)}
                disabled={!car.isAvailable}
              >
                Book Now
              </PrimaryButton>
            </MaterialCard>
          </Grid>
        </Grid>

        <Box sx={pageStyles.section}>
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Reviews
          </Typography>
          {reviews.length === 0 ? (
            <EmptyState title="No reviews yet" description="Be the first to review this car." />
          ) : (
            reviews.map((review) => (
              <MaterialCard key={review.id} sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1">{review.title}</Typography>
                  <Rating value={review.rating} readOnly size="small" />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {review.comment}
                </Typography>
              </MaterialCard>
            ))
          )}
        </Box>
      </Container>
    </>
  )
}

export default CarDetailsPage
