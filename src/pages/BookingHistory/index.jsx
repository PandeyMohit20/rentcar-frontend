import { Container, Typography } from '@mui/material'
import Seo from '@/components/common/Seo'

/**
 * Booking history page — list of user bookings.
 */
function BookingHistoryPage() {
  return (
    <>
      <Seo title="Booking History" description="View your past and upcoming bookings." />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Booking History
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Booking history functionality is under construction.
        </Typography>
      </Container>
    </>
  )
}

export default BookingHistoryPage
