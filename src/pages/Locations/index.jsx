import { Box, Container, Grid, Typography, CircularProgress } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import Seo from '@/components/common/Seo'
import PageHeader from '@/components/common/PageHeader'
import MaterialCard from '@/components/ui/MaterialCard'
import EmptyState from '@/components/common/EmptyState'
import { ROUTES } from '@/constants/routes'
import { locationService } from '@/services/modules'
import { useApiQuery } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'

export default function LocationsPage() {
  const { data, isLoading, error, refetch } = useApiQuery({
    queryKey: QUERY_KEYS.LOCATIONS.CITIES,
    queryFn: () => locationService.getCities(),
  })
  return (
    <>
      <Seo title="Locations" description="Find active RentCar service cities." />
      <PageHeader
        title="Our Locations"
        subtitle="Explore active service cities and pickup areas."
        breadcrumbs={[{ label: 'Home', to: ROUTES.HOME }, { label: 'Locations' }]}
      />
      <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          {isLoading ? (
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <EmptyState
              title="Unable to load locations"
              description={error.message || 'Please try again.'}
              actionLabel="Retry"
              onAction={refetch}
            />
          ) : !data?.items?.length ? (
            <EmptyState
              title="No locations available"
              description="No active service cities were returned."
            />
          ) : (
            <Grid container spacing={3}>
              {data.items.map((city) => (
                <Grid key={city.id} size={{ xs: 12, sm: 6, md: 3 }}>
                  <MaterialCard sx={{ p: 3, height: '100%' }}>
                    <LocationOnIcon color="primary" sx={{ mb: 1, fontSize: 36 }} />
                    <Typography variant="h6">{city.name}</Typography>
                    {city.state && (
                      <Typography variant="body2" color="text.secondary">
                        {city.state}
                        {city.country ? `, ${city.country}` : ''}
                      </Typography>
                    )}
                  </MaterialCard>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </>
  )
}
