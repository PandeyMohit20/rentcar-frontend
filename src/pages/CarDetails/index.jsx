import TaxBreakdown from '@/features/invoice/TaxBreakdown'
import { useEffect, useMemo, useState } from 'react'
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Grid, Chip, Stack, Alert, Divider } from '@mui/material'
import Seo from '@/components/common/Seo'
import MaterialCard from '@/components/ui/MaterialCard'
import PrimaryButton from '@/components/buttons/PrimaryButton'
import EmptyState from '@/components/common/EmptyState'
import ContentSkeleton from '@/components/common/ContentSkeleton'
import ImageLazy from '@/components/common/ImageLazy'
import { bookingService, carService, pricingService } from '@/services/modules'
import { useApiMutation, useApiQuery, useQueryClient } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { formatCurrency } from '@/utils/formatters'
import { formatBusinessDateTime, validateBusinessInterval } from '@/utils/dateTime'
import quoteSession from '@/services/api/quoteSession'
import bookingAttemptSession from '@/services/api/bookingAttemptSession'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/constants/routes'
import { pageStyles } from './styles'

function CarDetailsPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user, isAuthenticated, isRestoring } = useAuth()
  const params = useMemo(() => new URLSearchParams(location.search), [location.search])
  const pickup = params.get('pickup')
  const returnValue = params.get('return')
  const branchId = params.get('branchId')
  const intervalError =
    pickup || returnValue
      ? validateBusinessInterval(pickup, returnValue)
      : 'Select a valid interval to get a quote.'
  const hasValidInterval = !intervalError && Boolean(pickup && returnValue)
  const contextKey = `${id}|${pickup || ''}|${returnValue || ''}|${branchId || ''}`
  const [quote, setQuote] = useState(() => {
    const current = quoteSession.get()
    return current?.contextKey === contextKey ? current : null
  })
  const [quoteError, setQuoteError] = useState('')
  const [bookingError, setBookingError] = useState('')
  const [now, setNow] = useState(() => Date.now())
  const {
    data: car,
    isLoading,
    error,
    refetch,
  } = useApiQuery({
    queryKey: QUERY_KEYS.CARS.DETAILS(id),
    queryFn: () => carService.getCarDetails(id),
    enabled: Boolean(id),
  })
  const quoteMutation = useApiMutation({
    mutationFn: pricingService.createQuote,
    onSuccess: (result) => {
      const value = { ...result, contextKey }
      quoteSession.set(value)
      setQuote(value)
      setQuoteError('')
      setNow(Date.now())
    },
    onError: (requestError) => {
      quoteSession.clear()
      setQuote(null)
      setQuoteError(requestError?.message || 'Unable to create a trusted quote.')
    },
  })
  const bookingMutation = useApiMutation({
    mutationFn: bookingService.createBooking,
    onSuccess: (booking) => {
      bookingAttemptSession.saveBooking(booking, user?.id, `${location.pathname}${location.search}`)
      bookingAttemptSession.clearPreCreate()
      quoteSession.clear()
      setQuote(null)
      setBookingError('')
      queryClient.setQueryData(QUERY_KEYS.BOOKINGS.DETAILS(booking.id), booking)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKINGS.MINE })
      navigate(ROUTES.BOOKING_STATUS_WITH_ID(booking.id), { replace: true })
    },
    onError: (requestError) => {
      setBookingError(
        requestError?.isNetworkError
          ? 'The booking result is unknown because the network response was lost. Check My Bookings before trying again. Retrying this same trip reuses your booking attempt.'
          : requestError?.message || 'Unable to create the booking.'
      )
    },
  })

  const activeQuote = quote?.contextKey === contextKey ? quote : null
  useEffect(() => {
    const current = quoteSession.get()
    if (current && current.contextKey !== contextKey) quoteSession.clear()
  }, [contextKey])
  useEffect(() => {
    if (!activeQuote?.expiresAt) return undefined
    const updateClock = () => setNow(Date.now())
    const initialTimer = window.setTimeout(updateClock, 0)
    const timer = window.setInterval(updateClock, 1000)
    return () => {
      window.clearTimeout(initialTimer)
      window.clearInterval(timer)
    }
  }, [activeQuote?.expiresAt])

  const expiresAtMs = activeQuote?.expiresAt ? new Date(activeQuote.expiresAt).getTime() : 0
  const quoteExpired = Boolean(activeQuote && (!expiresAtMs || expiresAtMs <= now))
  const remainingMinutes =
    activeQuote && !quoteExpired ? Math.max(1, Math.ceil((expiresAtMs - now) / 60000)) : 0
  const createQuote = () => {
    if (!hasValidInterval || quoteMutation.isPending || bookingMutation.isPending) return
    quoteSession.clear()
    setQuote(null)
    quoteMutation.mutate({ carId: id, pickupDateTime: pickup, returnDateTime: returnValue })
  }
  const createBooking = () => {
    if (isRestoring || !activeQuote || bookingMutation.isPending) return
    if (new Date(activeQuote.expiresAt).getTime() <= Date.now()) {
      quoteSession.clear()
      setNow(Date.now())
      return
    }
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { state: { from: location } })
      return
    }
    setBookingError('')
    bookingMutation.mutate({
      quoteToken: activeQuote.quoteToken,
      idempotencyKey: bookingAttemptSession.getOrCreateKey(`${user.id}|${activeQuote.contextKey}`),
    })
  }

  useEffect(() => {
    if (quoteExpired) quoteSession.clear()
  }, [quoteExpired])

  if (isLoading)
    return (
      <Container maxWidth="lg">
        <ContentSkeleton label="Loading car details" cards={1} />
      </Container>
    )
  if (error || !car?.id)
    return (
      <Container maxWidth="lg" sx={pageStyles.container}>
        <EmptyState
          title="Car not found"
          description={
            error?.message || 'The requested car is not available in the public catalog.'
          }
          actionLabel="Retry"
          onAction={refetch}
        />
      </Container>
    )

  return (
    <>
      <Seo
        title={`${car.brand} ${car.model}`}
        description={`View ${car.brand} ${car.model} rental details.`}
      />
      <Container maxWidth="lg" sx={pageStyles.container}>
        <Typography component="h1" variant="h4" sx={pageStyles.title}>
          {car.brand} {car.model}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={pageStyles.subtitle}>
          {[car.variant, car.year, car.fuelType, car.transmission].filter(Boolean).join(' • ')}
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <MaterialCard sx={{ p: 3 }}>
              <ImageLazy
                src={car.primaryImageUrl || '/placeholder-car.svg'}
                alt={`${car.brand} ${car.model}`}
                ratio="16/10"
              />
              {car.images.length > 1 && (
                <Stack direction="row" spacing={1} sx={{ mt: 2, overflowX: 'auto' }}>
                  {car.images.slice(1).map((image) => (
                    <Box key={image.id || image.url} sx={{ width: 120, flex: '0 0 auto' }}>
                      <ImageLazy src={image.url} alt={image.alt} ratio="16/10" />
                    </Box>
                  ))}
                </Stack>
              )}
              {car.features.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
                    Features
                  </Typography>
                  <Box sx={pageStyles.featuresBox}>
                    {car.features.map((feature) => (
                      <Chip
                        key={feature.id || feature.name}
                        label={feature.name}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </>
              )}
            </MaterialCard>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <MaterialCard sx={{ p: 3, position: 'sticky', top: 90 }}>
              <Typography variant="h5" color="primary">
                {formatCurrency(car.dailyPrice, car.currencyCode)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                per day — discovery price, not a final quote
              </Typography>
              {car.seatingCapacity && (
                <Typography sx={{ mt: 2 }}>Seats: {car.seatingCapacity}</Typography>
              )}
              {car.branch?.name && (
                <Typography sx={{ mt: 1 }}>Branch: {car.branch.name}</Typography>
              )}
              {car.vendor?.companyName && (
                <Typography sx={{ mt: 1 }}>Provider: {car.vendor.companyName}</Typography>
              )}
              {hasValidInterval ? (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2">Selected trip</Typography>
                  <Typography variant="body2">Pickup: {formatBusinessDateTime(pickup)}</Typography>
                  <Typography variant="body2">
                    Return: {formatBusinessDateTime(returnValue)}
                  </Typography>
                  <PrimaryButton
                    fullWidth
                    onClick={createQuote}
                    disabled={quoteMutation.isPending}
                    sx={{ mt: 2 }}
                  >
                    {quoteMutation.isPending
                      ? 'Generating quote…'
                      : quoteExpired
                        ? 'Get Fresh Quote'
                        : activeQuote
                          ? 'Refresh Quote'
                          : 'Get Quote'}
                  </PrimaryButton>
                </Box>
              ) : (
                <>
                  <Alert severity="info" sx={{ mt: 3 }}>
                    {intervalError}
                  </Alert>
                  <PrimaryButton
                    fullWidth
                    component={Link}
                    to={`${ROUTES.SEARCH}?${params}`}
                    sx={{ mt: 2 }}
                  >
                    Check Availability
                  </PrimaryButton>
                </>
              )}
              {quoteError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {quoteError}
                </Alert>
              )}
              {activeQuote && (
                <Box sx={{ mt: 3 }}>
                  <Divider sx={{ mb: 2 }} />
                  <TaxBreakdown snapshot={activeQuote.financialSnapshot} />
                  <Typography component="h2" variant="h6">
                    Trusted quote
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Your rental price for the selected trip. Reserve to place a payment hold.
                  </Typography>
                  {activeQuote.duration?.breakdown?.map((unit, index) => (
                    <Box
                      key={`${unit.unit}-${index}`}
                      sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}
                    >
                      <Typography>
                        {unit.count} × {unit.unit}
                      </Typography>
                      <Typography>
                        {formatCurrency(unit.amount, activeQuote.currencyCode)}
                      </Typography>
                    </Box>
                  ))}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Typography>Rental subtotal</Typography>
                    <Typography>
                      {formatCurrency(
                        activeQuote.pricing?.rentalSubtotal,
                        activeQuote.currencyCode
                      )}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Security deposit</Typography>
                    <Typography>
                      {formatCurrency(
                        activeQuote.pricing?.securityDeposit,
                        activeQuote.currencyCode
                      )}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography fontWeight={700}>Total payable</Typography>
                    <Typography fontWeight={700}>
                      {formatCurrency(activeQuote.pricing?.payableAmount, activeQuote.currencyCode)}
                    </Typography>
                  </Box>
                  <Alert severity={quoteExpired ? 'warning' : 'success'} sx={{ mt: 2 }}>
                    {quoteExpired
                      ? 'This quote has expired. Request a fresh quote.'
                      : `Expires ${formatBusinessDateTime(activeQuote.expiresAt)} (about ${remainingMinutes} min remaining).`}
                  </Alert>
                  {!quoteExpired && (
                    <PrimaryButton
                      fullWidth
                      onClick={createBooking}
                      disabled={bookingMutation.isPending || isRestoring}
                      sx={{ mt: 2 }}
                    >
                      {bookingMutation.isPending
                        ? 'Creating booking…'
                        : isAuthenticated
                          ? 'Reserve & Continue to Payment'
                          : 'Sign In to Continue'}
                    </PrimaryButton>
                  )}
                  {bookingError && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {bookingError}
                    </Alert>
                  )}
                </Box>
              )}
            </MaterialCard>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
function CarDetailsRoute() {
  const location = useLocation()
  return <CarDetailsPage key={`${location.pathname}${location.search}`} />
}
export default CarDetailsRoute
