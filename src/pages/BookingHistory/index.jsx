import { Box, Container, Typography, Chip, CircularProgress } from '@mui/material'
import Seo from '@/components/common/Seo'
import MaterialCard from '@/components/ui/MaterialCard'
import EmptyState from '@/components/common/EmptyState'
import { bookingService } from '@/services/modules'
import { useApiQuery } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { formatDate } from '@/utils/date'
import { formatCurrency } from '@/utils/formatters'
import { pageStyles } from './styles'

const statusColor = (status) => {
  switch (status) {
    case 'confirmed':
      return 'success'
    case 'completed':
      return 'info'
    case 'cancelled':
      return 'error'
    case 'in_progress':
      return 'warning'
    default:
      return 'default'
  }
}

/**
 * Booking History page — list of user bookings.
 */
function BookingHistoryPage() {
  const { data, isLoading, error } = useApiQuery({
    queryKey: QUERY_KEYS.BOOKINGS.HISTORY({}),
    queryFn: () => bookingService.getBookingHistory({}),
  })

  const bookings = data?.data ?? data?.bookings ?? []

  return (
    <>
      <Seo title="Booking History" description="View your past and upcoming bookings." />
      <Container maxWidth="lg" sx={pageStyles.container}>
        <Typography variant="h4" gutterBottom sx={pageStyles.header}>
          Booking History
        </Typography>

        {isLoading ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <EmptyState title="Unable to load bookings" description="Please try again later." />
        ) : bookings.length === 0 ? (
          <EmptyState title="No bookings yet" description="Your bookings will appear here." />
        ) : (
          bookings.map((booking) => (
            <MaterialCard key={booking.id} sx={{ p: 3, mb: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 1,
                }}
              >
                <Box>
                  <Typography variant="subtitle1">Booking #{booking.id}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {booking.car ? `${booking.car.brand} ${booking.car.model}` : 'Car'} •{' '}
                    {formatDate(booking.startDate)} → {formatDate(booking.endDate)}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h6" color="primary">
                    {formatCurrency(booking.totalAmount)}
                  </Typography>
                  <Chip label={booking.status} color={statusColor(booking.status)} size="small" />
                </Box>
              </Box>
            </MaterialCard>
          ))
        )}
      </Container>
    </>
  )
}

export default BookingHistoryPage
