import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { AccountPageShell, TripCard } from '@/components/account'
import { useTripHistory } from '@/features/trips'
import { ROUTES } from '@/constants/routes'
import EmptyState from '@/components/common/EmptyState'

/**
 * Trip History page — list of completed/upcoming trips.
 */
function TripsPage() {
  const navigate = useNavigate()
  const { data, isLoading } = useTripHistory()

  const trips = useMemo(() => data?.trips ?? [], [data])

  return (
    <AccountPageShell title="Trip History" description="Review all your past and upcoming trips.">
      {isLoading && <Typography variant="body2">Loading trips…</Typography>}
      {!isLoading && trips.length === 0 && (
        <EmptyState
          title="No trips yet"
          description="Once you complete a trip it will appear here."
        />
      )}
      <Box>
        {trips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            onClick={() => navigate(ROUTES.TRIP_DETAILS_WITH_ID(trip.id))}
          />
        ))}
      </Box>
    </AccountPageShell>
  )
}

export default TripsPage
