import { Container, Typography } from '@mui/material'
import Seo from '@/components/common/Seo'

/**
 * Legal page — terms, privacy, and policies.
 */
function LegalPage() {
  return (
    <>
      <Seo title="Legal" description="Terms of service, privacy policy and legal information." />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Legal
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Legal content is under construction.
        </Typography>
      </Container>
    </>
  )
}

export default LegalPage
