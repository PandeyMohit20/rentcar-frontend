import { Container, Typography } from '@mui/material'
import Seo from '@/components/common/Seo'

/**
 * Search page — car search and results.
 */
function SearchPage() {
  return (
    <>
      <Seo
        title="Search Cars"
        description="Search available cars by location, dates and filters."
      />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Search Cars
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Search functionality is under construction.
        </Typography>
      </Container>
    </>
  )
}

export default SearchPage
