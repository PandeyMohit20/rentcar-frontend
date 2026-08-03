import { Container, Typography } from '@mui/material'
import Seo from '@/components/common/Seo'

/**
 * Offers page — promotional offers.
 */
function OffersPage() {
  return (
    <>
      <Seo title="Offers" description="Explore current promotional offers and coupons." />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Offers
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Offers functionality is under construction.
        </Typography>
      </Container>
    </>
  )
}

export default OffersPage
