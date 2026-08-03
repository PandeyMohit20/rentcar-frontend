import { Container, Typography } from '@mui/material'
import Seo from '@/components/common/Seo'

/**
 * FAQ page — frequently asked questions.
 */
function FaqPage() {
  return (
    <>
      <Seo title="FAQ" description="Frequently asked questions and answers." />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          FAQ
        </Typography>
        <Typography variant="body1" color="text.secondary">
          FAQ functionality is under construction.
        </Typography>
      </Container>
    </>
  )
}

export default FaqPage
