import { Alert, Box, Button, Container, Grid, Skeleton, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import Seo from '@/components/common/Seo'
import CarCard from '@/components/cards/CarCard'
import EmptyState from '@/components/common/EmptyState'
import HeroBanner from '@/components/sections/HeroBanner'
import HeroSearchForm from '@/components/sections/HeroSearchForm'
import { ROUTES } from '@/constants/routes'
import { carService, locationService } from '@/services/modules'
import { useApiQuery } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { toApiDateTime, validateBusinessInterval } from '@/utils/dateTime'
import { useToast } from '@/contexts/ToastContext'
const heroImage = 'https://wallpaperaccess.com/full/11208.jpg'
function HomePage() {
  const navigate = useNavigate()
  const { showError } = useToast()
  const { data, isLoading, error, refetch } = useApiQuery({
    queryKey: QUERY_KEYS.CARS.FEATURED,
    queryFn: () => carService.getFeaturedCars(),
  })

  const {
    data: branchData,
    isLoading: branchesLoading,
    error: branchesError,
    refetch: refetchBranches,
  } = useApiQuery({
    queryKey: QUERY_KEYS.LOCATIONS.BRANCHES,
    queryFn: () => locationService.getBranches(),
  })
  const featuredCars = data?.cars ?? []
  const branches = (branchData?.items ?? []).map((branch) => ({
    id: branch.id,
    label: [branch.name, branch.city].filter(Boolean).join(', '),
  }))
  const handleSearch = ({ branchId, pickupDate, pickupTime, returnDate, returnTime, brand }) => {
    const params = new URLSearchParams()
    if (branchId) params.set('branchId', branchId)
    if (brand) params.set('brand', brand)
    const hasAnyInterval = pickupDate || pickupTime || returnDate || returnTime
    if (hasAnyInterval) {
      const pickup = toApiDateTime(pickupDate, pickupTime)
      const returnValue = toApiDateTime(returnDate, returnTime)
      const intervalError = validateBusinessInterval(pickup, returnValue)
      if (intervalError) return showError(intervalError)
      params.set('pickup', pickup)
      params.set('return', returnValue)
    }
    navigate(`${ROUTES.SEARCH}?${params}`)
  }

  return (
    <>
      <Seo
        title="Find a car"
        description="Search cars by branch and trip dates, then review your rental quote."
      />
      <HeroBanner
        title="Find your next drive"
        subtitle="Choose an operating branch and your trip dates. Review the full quote before reserving."
        image={heroImage}
      >
        {branchesLoading ? (
          <Skeleton variant="rounded" height={240} />
        ) : branchesError ? (
          <Alert severity="warning" action={<Button onClick={refetchBranches}>Retry</Button>}>
            Locations could not be loaded. Please retry.
          </Alert>
        ) : (
          <HeroSearchForm
            locations={branches}
            categories={[...new Set(featuredCars.map((car) => car.brand).filter(Boolean))]}
            onSearch={handleSearch}
          />
        )}
        <Typography sx={{ mt: 2, color: 'common.white' }}>
          Trip times are in Asia/Kolkata. Leave dates empty to browse the fleet.
        </Typography>
      </HeroBanner>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            mb: 3,
          }}
        >
          <Typography component="h2" variant="h4">
            Explore the fleet
          </Typography>
          <Button component={Link} to={ROUTES.SEARCH}>
            Browse all cars
          </Button>
        </Box>
        {isLoading ? (
          <Grid container spacing={3}>
            {[0, 1, 2].map((i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                <Skeleton variant="rounded" height={300} />
              </Grid>
            ))}
          </Grid>
        ) : error ? (
          <EmptyState
            title="Unable to load cars"
            description={error.message}
            actionLabel="Retry"
            onAction={refetch}
          />
        ) : !featuredCars.length ? (
          <EmptyState
            title="No featured cars yet"
            description="Browse the fleet to see cars listed by our operating branches."
            actionLabel="Find a car"
            onAction={() => navigate(ROUTES.SEARCH)}
          />
        ) : (
          <Grid container spacing={3}>
            {featuredCars.map((car) => (
              <Grid key={car.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <CarCard car={car} />
              </Grid>
            ))}
          </Grid>
        )}
        <Box
          sx={{ mt: 6, p: { xs: 2, md: 4 }, border: 1, borderColor: 'divider', borderRadius: 3 }}
        >
          <Typography component="h2" variant="h5" gutterBottom>
            Your trip, step by step
          </Typography>
          <Grid container spacing={3}>
            {[
              ['Find a car', 'Check availability for your selected branch and dates.'],
              [
                'Review your quote',
                'See the rental breakdown, deposit and total before reserving.',
              ],
              [
                'Track your booking',
                'Complete payment with Razorpay and follow confirmation in My Bookings.',
              ],
            ].map(([title, copy], i) => (
              <Grid key={title} size={{ xs: 12, md: 4 }}>
                <Typography component="h3" variant="h6">
                  {i + 1}. {title}
                </Typography>
                <Typography color="text.secondary">{copy}</Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </>
  )
}
export default HomePage
