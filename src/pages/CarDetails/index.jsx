import { Container, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
import Seo from '@/components/common/Seo'

/**
 * Car details page.
 */
function CarDetailsPage() {
  const { id } = useParams()

  return (
    <>
      <Seo title="Car Details" description="View car details, features and pricing." />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Car Details
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Car ID: {id}
        </Typography>
      </Container>
    </>
  )
}

export default CarDetailsPage
