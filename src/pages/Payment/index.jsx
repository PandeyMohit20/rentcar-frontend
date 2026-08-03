import { Container, Typography } from '@mui/material'
import Seo from '@/components/common/Seo'

/**
 * Payment page — payment gateway integration.
 */
function PaymentPage() {
  return (
    <>
      <Seo title="Payment" description="Complete your payment securely." />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Payment
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Payment functionality is under construction.
        </Typography>
      </Container>
    </>
  )
}

export default PaymentPage
