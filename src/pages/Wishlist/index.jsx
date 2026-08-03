import { Container, Typography } from '@mui/material'
import Seo from '@/components/common/Seo'

/**
 * Wishlist page — saved cars.
 */
function WishlistPage() {
  return (
    <>
      <Seo title="Wishlist" description="Your saved cars." />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Wishlist
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Wishlist functionality is under construction.
        </Typography>
      </Container>
    </>
  )
}

export default WishlistPage
