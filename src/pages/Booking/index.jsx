import { Container, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
import Seo from '@/components/common/Seo'

/**
 * Booking page — create a booking for a car.
 */
function BookingPage() {
  const { carId } = useParams()

  return (
    <>
      <Seo title="Booking" description="Book your car with flexible dates and locations." />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Book a Car
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Car ID: {carId}
        </Typography>
      </Container>
    </>
  )
}

export default BookingPage
