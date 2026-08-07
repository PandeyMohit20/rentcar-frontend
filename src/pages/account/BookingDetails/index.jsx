import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Grid, Typography, Chip, Button } from '@mui/material'
import { AccountPageShell } from '@/components/account'
import { useBookingDetails, useCancelBooking } from '@/features/bookings'
import { useToast } from '@/contexts/ToastContext'
import MaterialCard from '@/components/ui/MaterialCard'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { ROUTES } from '@/constants/routes'

/**
 * Booking Details page — full booking info + invoice placeholder.
 */
function BookingDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const { data: bookingData, isLoading } = useBookingDetails(id)
  const cancelBooking = useCancelBooking()

  const booking = useMemo(() => bookingData ?? {}, [bookingData])

  const handleCancel = async () => {
    try {
      await cancelBooking.mutateAsync(id)
      showSuccess('Booking cancelled (placeholder).')
      navigate(ROUTES.MY_BOOKINGS)
    } catch (error) {
      showError(error?.message || 'Cancellation failed.')
    }
  }

  return (
    <AccountPageShell title="Booking Details" description={`Booking ${id}`}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <MaterialCard sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {booking.car ? `${booking.car.brand} ${booking.car.model}` : 'Car'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start: {formatDate(booking.startDate)} — End: {formatDate(booking.endDate)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Amount: {formatCurrency(booking.totalAmount)}
            </Typography>
            <Chip label={booking.status ?? 'pending'} sx={{ mt: 1 }} />
          </MaterialCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <MaterialCard sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Actions
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              sx={{ mb: 1 }}
              onClick={() => navigate(ROUTES.INVOICE_PREVIEW)}
            >
              View Invoice
            </Button>
            <Button
              variant="contained"
              color="error"
              fullWidth
              onClick={handleCancel}
              disabled={cancelBooking.isPending}
            >
              Cancel Booking
            </Button>
          </MaterialCard>
        </Grid>
      </Grid>
    </AccountPageShell>
  )
}

export default BookingDetailsPage
