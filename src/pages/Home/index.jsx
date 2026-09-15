import { Alert, Box, Button, Container, Grid, Skeleton, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import ImageLazy from '@/components/common/ImageLazy'
import Seo from '@/components/common/Seo'
import CarCard from '@/components/cards/CarCard'
import EmptyState from '@/components/common/EmptyState'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined'
import HeroSearchForm from '@/components/sections/HeroSearchForm'
import { ROUTES } from '@/constants/routes'
import { carService, locationService } from '@/services/modules'
import { useApiQuery } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { toApiDateTime, validateBusinessInterval } from '@/utils/dateTime'
import { useToast } from '@/contexts/ToastContext'

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
        title="Self-drive car rentals"
        description="Your journey. Your car. Your way. Find a self-drive rental and review your trip quote with CaronRent."
      />
      <Box
        component="section"
        sx={{
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          pt: { xs: 4, md: 7 },
          pb: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="overline" color="primary.main">
                SELF-DRIVE. ON YOUR TERMS.
              </Typography>
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: '2.65rem', sm: '3.7rem', md: '4.25rem' },
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: '-0.055em',
                  mt: 2,
                  mb: 2.5,
                }}
              >
                Your Journey.
                <br />
                Your Car.{' '}
                <Box component="span" sx={{ color: 'primary.main' }}>
                  Your Way.
                </Box>
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ maxWidth: 460, fontSize: { xs: 16, md: 18 }, mb: 3 }}
              >
                From everyday plans to the open road. Find a car for your next trip, with the full
                price in view before you reserve.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: 'none', md: 'block' } }}>
              {featuredCars[0]?.primaryImageUrl ? (
                <Box sx={{ borderRadius: 2, overflow: 'hidden' }}>
                  <ImageLazy
                    src={featuredCars[0].primaryImageUrl}
                    alt={`${featuredCars[0].brand} ${featuredCars[0].model}`}
                    ratio="4/3"
                  />
                </Box>
              ) : (
                <Box sx={{ borderLeft: 3, borderColor: 'primary.main', pl: 4, py: 2 }}>
                  <RouteOutlinedIcon sx={{ color: 'primary.main', fontSize: 42, mb: 2 }} />
                  <Typography variant="h5" sx={{ mb: 1 }}>
                    A little more freedom.
                    <br />A lot more possibilities.
                  </Typography>
                  <Typography color="text.secondary">
                    Choose your pickup point and trip dates.
                    <br />
                    We will help you find your next drive.
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
          <Box sx={{ mt: { xs: 1, md: 3 } }}>
            {branchesLoading ? (
              <Skeleton variant="rounded" height={240} />
            ) : branchesError ? (
              <Alert severity="error" action={<Button onClick={refetchBranches}>Retry</Button>}>
                {branchesError.message || 'Pickup locations could not be loaded.'}
              </Alert>
            ) : (
              <HeroSearchForm locations={branches} onSearch={handleSearch} />
            )}
          </Box>
          {!branchesError && branches.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Explore pickup locations
              </Typography>
              {branches.slice(0, 4).map((branch) => (
                <Button
                  key={branch.id}
                  size="small"
                  color="inherit"
                  component={Link}
                  to={`${ROUTES.SEARCH}?branchId=${encodeURIComponent(branch.id)}`}
                  sx={{ fontSize: 12 }}
                >
                  {branch.label}
                  <ArrowForwardRoundedIcon sx={{ ml: 0.5, fontSize: 14 }} />
                </Button>
              ))}
            </Box>
          )}
        </Container>
      </Box>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={3} sx={{ pb: { xs: 4, md: 6 } }}>
          {[
            [
              ReceiptLongOutlinedIcon,
              'Know your total',
              'Review your rental and deposit before reserving.',
            ],
            [
              VerifiedUserOutlinedIcon,
              'Secure checkout',
              'Complete your payment through Razorpay.',
            ],
            [
              RouteOutlinedIcon,
              'Your trip, in one place',
              'Follow payment and reservation updates in your account.',
            ],
          ].map(([Icon, title, copy]) => (
            <Grid key={title} size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Icon sx={{ color: 'primary.main', mt: 0.5 }} />
                <Box>
                  <Typography fontWeight={700}>{title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {copy}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'end',
            justifyContent: 'space-between',
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="overline" color="primary.main">
              FIND YOUR FIT
            </Typography>
            <Typography component="h2" variant="h3" sx={{ mt: 0.5 }}>
              A car for your next chapter
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Explore the fleet. Pick the drive that feels like you.
            </Typography>
          </Box>
          <Button component={Link} to={ROUTES.SEARCH} endIcon={<ArrowForwardRoundedIcon />}>
            Explore all cars
          </Button>
        </Box>
        {isLoading ? (
          <Grid container spacing={3}>
            {[0, 1, 2].map((i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                <Skeleton variant="rounded" height={350} />
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
          component="section"
          id="how-it-works"
          sx={{ mt: { xs: 6, md: 9 }, py: 5, borderTop: 1, borderColor: 'divider' }}
        >
          <Typography variant="overline" color="primary.main">
            LESS PLANNING. MORE GOING.
          </Typography>
          <Typography component="h2" variant="h3" sx={{ mt: 1, mb: 4 }}>
            How CaronRent works
          </Typography>
          <Grid container spacing={4}>
            {[
              ['Find your drive', 'Choose a pickup location and dates to see available cars.'],
              ['Make it yours', 'Review a fresh quote, sign in and reserve your car.'],
              [
                'You are ready to go',
                'Complete payment and check your confirmation in My Bookings.',
              ],
            ].map(([title, copy], i) => (
              <Grid key={title} size={{ xs: 12, md: 4 }}>
                <Typography sx={{ color: 'primary.main', fontSize: 32, fontWeight: 800, mb: 1 }}>
                  0{i + 1}
                </Typography>
                <Typography component="h3" variant="h6">
                  {title}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  {copy}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box
          sx={{
            p: { xs: 3, md: 4 },
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            borderRadius: 2,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 3,
          }}
        >
          <Box>
            <Typography component="h2" variant="h5">
              Confidence at every turn.
            </Typography>
            <Typography sx={{ mt: 1, maxWidth: 620 }}>
              Your quote before you reserve. Your payment status as it updates. Your booking details
              whenever you need them.
            </Typography>
          </Box>
          <Button component={Link} to={ROUTES.MY_BOOKINGS} variant="outlined" color="inherit">
            My Bookings
          </Button>
        </Box>
      </Container>
    </>
  )
}
export default HomePage
