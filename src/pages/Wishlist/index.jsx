import { Box, Container, Typography, Grid, CircularProgress } from '@mui/material'
import Seo from '@/components/common/Seo'
import CarCard from '@/components/cards/CarCard'
import EmptyState from '@/components/common/EmptyState'
import { wishlistService } from '@/services/modules'
import { useApiQuery } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { useAppSelector } from '@/hooks/useRedux'
import { pageStyles } from './styles'

/**
 * Wishlist page — saved cars.
 */
function WishlistPage() {
  const wishlistCarIds = useAppSelector((state) => state.wishlist.carIds)

  const { data, isLoading, error } = useApiQuery({
    queryKey: QUERY_KEYS.WISHLIST.ALL,
    queryFn: wishlistService.listWishlist,
  })

  const cars = data?.data ?? data?.cars ?? []

  return (
    <>
      <Seo title="Wishlist" description="Your saved cars." />
      <Container maxWidth="lg" sx={pageStyles.container}>
        <Typography variant="h4" gutterBottom sx={pageStyles.header}>
          Wishlist
        </Typography>

        {isLoading ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <EmptyState title="Unable to load wishlist" description="Please try again later." />
        ) : cars.length === 0 && wishlistCarIds.length === 0 ? (
          <EmptyState
            title="Your wishlist is empty"
            description="Save cars you like to find them here."
          />
        ) : (
          <Grid container spacing={3}>
            {cars.map((car) => (
              <Grid item key={car.id} xs={12} sm={6} md={4}>
                <CarCard car={car} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  )
}

export default WishlistPage
