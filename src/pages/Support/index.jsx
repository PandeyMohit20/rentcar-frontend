import { Container, Typography } from '@mui/material'
import Seo from '@/components/common/Seo'

/**
 * Support page — help and support.
 */
function SupportPage() {
  return (
    <>
      <Seo title="Support" description="Get help with bookings, payments and more." />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Support
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Support functionality is under construction.
        </Typography>
      </Container>
    </>
  )
}

export default SupportPage
