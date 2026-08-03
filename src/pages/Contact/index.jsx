import { Container, Typography } from '@mui/material'
import Seo from '@/components/common/Seo'

/**
 * Contact page — contact form and details.
 */
function ContactPage() {
  return (
    <>
      <Seo title="Contact Us" description="Get in touch with our team." />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Contact functionality is under construction.
        </Typography>
      </Container>
    </>
  )
}

export default ContactPage
