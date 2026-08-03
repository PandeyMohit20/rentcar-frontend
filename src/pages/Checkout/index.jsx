import { Container, Typography } from '@mui/material'
import Seo from '@/components/common/Seo'

/**
 * Checkout page — review booking and enter billing details.
 */
function CheckoutPage() {
  return (
    <>
      <Seo title="Checkout" description="Review your booking and complete checkout." />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Checkout
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Checkout functionality is under construction.
        </Typography>
      </Container>
    </>
  )
}

export default CheckoutPage
