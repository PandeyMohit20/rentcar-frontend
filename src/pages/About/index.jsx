import { Container, Typography } from '@mui/material'
import Seo from '@/components/common/Seo'

/**
 * About page — company information.
 */
function AboutPage() {
  return (
    <>
      <Seo title="About Us" description="Learn more about our car rental platform." />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          About Us
        </Typography>
        <Typography variant="body1" color="text.secondary">
          About content is under construction.
        </Typography>
      </Container>
    </>
  )
}

export default AboutPage
