import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
  Alert,
} from '@mui/material'
import Seo from '@/components/common/Seo'
import MaterialCard from '@/components/ui/MaterialCard'
import CarCard from '@/components/cards/CarCard'
import EmptyState from '@/components/common/EmptyState'
import { availabilityService, carService, locationService } from '@/services/modules'
import { useApiQuery } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { parseApiDateTime, toApiDateTime, validateBusinessInterval } from '@/utils/dateTime'
import { ROUTES } from '@/constants/routes'
import { pageStyles } from './styles'

const fromUrl = (params) => {
  const pickup = parseApiDateTime(params.get('pickup'))
  const returnValue = parseApiDateTime(params.get('return'))
  return {
    branchId: params.get('branchId') || '',
    brand: params.get('brand') || '',
    fuelType: params.get('fuelType') || '',
    transmission: params.get('transmission') || '',
    seats: params.get('seats') || params.get('seatingCapacity') || '',
    pickupDate: pickup.date,
    pickupTime: pickup.time,
    returnDate: returnValue.date,
    returnTime: returnValue.time,
  }
}

function SearchPage() {
  const [urlParams, setUrlParams] = useSearchParams()
  const [draft, setDraft] = useState(() => fromUrl(urlParams))
  const [formError, setFormError] = useState('')
  const pickup = urlParams.get('pickup')
  const returnValue = urlParams.get('return')
  const intervalError = pickup || returnValue ? validateBusinessInterval(pickup, returnValue) : null
  const isAvailabilityMode = Boolean(pickup && returnValue && !intervalError)

  const request = useMemo(() => {
    const common = Object.fromEntries(
      ['branchId', 'brand', 'fuelType', 'transmission']
        .map((key) => [key, urlParams.get(key)])
        .filter(([, value]) => value)
    )
    const page = Math.max(1, Math.trunc(Number(urlParams.get('page'))) || 1)
    if (isAvailabilityMode)
      return {
        pickupDateTime: pickup,
        returnDateTime: returnValue,
        ...common,
        ...(urlParams.get('seats') ? { seats: Number(urlParams.get('seats')) } : {}),
        page,
        limit: 12,
      }
    return {
      ...common,
      ...(urlParams.get('seats') ? { seatingCapacity: Number(urlParams.get('seats')) } : {}),
      page,
      limit: 12,
    }
  }, [urlParams, isAvailabilityMode, pickup, returnValue])

  const { data, isLoading, error, refetch } = useApiQuery({
    queryKey: isAvailabilityMode
      ? QUERY_KEYS.AVAILABILITY.SEARCH(request)
      : QUERY_KEYS.CARS.SEARCH(request),
    queryFn: () =>
      isAvailabilityMode
        ? availabilityService.searchAvailability(request)
        : carService.searchCars(request),
    enabled: !intervalError,
    staleTime: isAvailabilityMode ? 15000 : undefined,
  })
  const { data: branchData } = useApiQuery({
    queryKey: QUERY_KEYS.LOCATIONS.BRANCHES,
    queryFn: () => locationService.getBranches(),
  })
  const update = (key) => (event) =>
    setDraft((current) => ({ ...current, [key]: event.target.value }))
  const submit = (event) => {
    event.preventDefault()
    setFormError('')
    const hasAnyInterval =
      draft.pickupDate || draft.pickupTime || draft.returnDate || draft.returnTime
    let nextPickup = null
    let nextReturn = null
    if (hasAnyInterval) {
      nextPickup = toApiDateTime(draft.pickupDate, draft.pickupTime)
      nextReturn = toApiDateTime(draft.returnDate, draft.returnTime)
      const validationError = validateBusinessInterval(nextPickup, nextReturn)
      if (validationError) return setFormError(validationError)
    }
    const next = new URLSearchParams()
    ;['branchId', 'brand', 'fuelType', 'transmission', 'seats'].forEach((key) => {
      if (draft[key]) next.set(key, draft[key])
    })
    if (nextPickup) next.set('pickup', nextPickup)
    if (nextReturn) next.set('return', nextReturn)
    setUrlParams(next)
  }
  const setPage = (page) => {
    const next = new URLSearchParams(urlParams)
    next.set('page', String(page))
    setUrlParams(next)
  }
  const detailUrl = (carId) => `${ROUTES.CAR_DETAILS_WITH_ID(carId)}?${urlParams}`
  const meta = data?.meta

  return (
    <>
      <Seo title="Search Cars" description="Browse cars or check real interval availability." />
      <Container maxWidth="lg" sx={pageStyles.container}>
        <Typography component="h1" variant="h4" gutterBottom sx={pageStyles.header}>
          Search Cars
        </Typography>
        <MaterialCard sx={pageStyles.formCard}>
          <Box component="form" onSubmit={submit}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  select
                  fullWidth
                  label="Operating branch"
                  value={draft.branchId}
                  onChange={update('branchId')}
                >
                  <MenuItem value="">All branches</MenuItem>
                  {(branchData?.items || []).map((branch) => (
                    <MenuItem key={branch.id} value={branch.id}>
                      {[branch.name, branch.city].filter(Boolean).join(', ')}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="Pickup date"
                  value={draft.pickupDate}
                  onChange={update('pickupDate')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  type="time"
                  label="Pickup time"
                  value={draft.pickupTime}
                  onChange={update('pickupTime')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="Return date"
                  value={draft.returnDate}
                  onChange={update('returnDate')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  type="time"
                  label="Return time"
                  value={draft.returnTime}
                  onChange={update('returnTime')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <TextField fullWidth label="Brand" value={draft.brand} onChange={update('brand')} />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <TextField
                  select
                  fullWidth
                  label="Fuel"
                  value={draft.fuelType}
                  onChange={update('fuelType')}
                >
                  <MenuItem value="">Any</MenuItem>
                  {['petrol', 'diesel', 'cng', 'electric', 'hybrid', 'lpg'].map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <TextField
                  select
                  fullWidth
                  label="Transmission"
                  value={draft.transmission}
                  onChange={update('transmission')}
                >
                  <MenuItem value="">Any</MenuItem>
                  {['automatic', 'manual'].map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Minimum seats"
                  value={draft.seats}
                  onChange={update('seats')}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <Button type="submit" variant="contained" size="large">
                  Search
                </Button>
              </Grid>
            </Grid>
            {formError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {formError}
              </Alert>
            )}
            {intervalError && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                {intervalError} Update the interval to run availability search.
              </Alert>
            )}
          </Box>
        </MaterialCard>
        <Typography variant="h5" gutterBottom sx={pageStyles.resultsTitle}>
          {isAvailabilityMode ? 'Available for your selected trip' : 'Browse cars'}
        </Typography>
        {isAvailabilityMode && (
          <Typography color="text.secondary">
            Availability checked now; no car is reserved or held.
          </Typography>
        )}
        {intervalError ? <Alert severity="warning">Correct your trip dates before searching for available cars.</Alert> : isLoading ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <EmptyState
            title={isAvailabilityMode ? 'Availability search failed' : 'Unable to load cars'}
            description={error.message || 'Please try again.'}
            actionLabel="Retry"
            onAction={refetch}
          />
        ) : !data?.cars?.length ? (
          <EmptyState
            title={
              isAvailabilityMode ? 'No cars are available for the selected time' : 'No cars found'
            }
            description="Change the dates, branch, or filters and try again."
          />
        ) : (
          <Grid container spacing={3}>
            {data.cars.map((car) => (
              <Grid key={car.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <CarCard car={car} to={detailUrl(car.id)} />
              </Grid>
            ))}
          </Grid>
        )}
        {!intervalError && meta?.totalPages > 1 && (
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 4 }}>
            <Button
              disabled={Number(meta.page) <= 1}
              onClick={() => setPage(Number(meta.page) - 1)}
            >
              Previous
            </Button>
            <Typography sx={{ py: 1 }}>
              Page {meta.page} of {meta.totalPages}
            </Typography>
            <Button
              disabled={Number(meta.page) >= Number(meta.totalPages)}
              onClick={() => setPage(Number(meta.page) + 1)}
            >
              Next
            </Button>
          </Box>
        )}
      </Container>
    </>
  )
}
function SearchRoute() { const [params] = useSearchParams(); return <SearchPage key={params.toString()} /> }
export default SearchRoute
