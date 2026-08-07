import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Grid, Typography, Rating, Button } from '@mui/material'
import { AccountPageShell, TripTimeline } from '@/components/account'
import { useTripDetails, useTripTimeline, useRateTrip } from '@/features/trips'
import { useToast } from '@/contexts/ToastContext'
import MaterialCard from '@/components/ui/MaterialCard'
import { formatCurrency } from '@/utils/formatters'

/**
 * Trip Details page — timeline, cost, rating and invoice placeholder.
 */
function TripDetailsPage() {
  const { id } = useParams()
  const { showSuccess, showError } = useToast()
  const { data: tripData } = useTripDetails(id)
  const { data: timelineData } = useTripTimeline(id)
  const rateTrip = useRateTrip()

  const [rating, setRating] = useState(0)

  const trip = useMemo(() => tripData ?? {}, [tripData])
  const events = useMemo(() => timelineData?.events ?? [], [timelineData])

  const handleRate = async () => {
    try {
      await rateTrip.mutateAsync({ id, rating })
      showSuccess('Trip rated successfully.')
    } catch (error) {
      showError(error?.message || 'Failed to rate trip.')
    }
  }

  return (
    <AccountPageShell title="Trip Details" description={`Trip ${id}`}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <TripTimeline events={events} />
          <MaterialCard sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Trip Cost
            </Typography>
            <Typography variant="h4" color="primary">
              {formatCurrency(trip.cost ?? 0)}
            </Typography>
          </MaterialCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <MaterialCard sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Rate your trip
            </Typography>
            <Rating value={rating} onChange={(e, v) => setRating(v ?? 0)} />
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleRate}
              disabled={rateTrip.isPending || rating === 0}
            >
              Submit Rating
            </Button>
          </MaterialCard>
          <MaterialCard sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Invoice
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {trip.invoice
                ? `Invoice #${trip.invoice}`
                : 'Invoice will be available after trip completion.'}
            </Typography>
          </MaterialCard>
        </Grid>
      </Grid>
    </AccountPageShell>
  )
}

export default TripDetailsPage
