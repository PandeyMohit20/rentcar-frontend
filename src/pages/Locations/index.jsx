import { Box, Container, Grid, Typography, Chip } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import Seo from '@/components/common/Seo'
import PageHeader from '@/components/common/PageHeader'
import MaterialCard from '@/components/ui/MaterialCard'
import StatsBand from '@/components/sections/StatsBand'
import Newsletter from '@/components/sections/Newsletter'
import { ROUTES } from '@/constants/routes'

const cities = [
  { city: 'Mumbai', locations: 'Andheri', count: '120+ cars' },
  { city: 'Delhi NCR', locations: 'Aerocity', count: '150+ cars' },
  { city: 'Bengaluru', locations: 'Indiranagar', count: '180+ cars' },
  { city: 'Hyderabad', locations: 'Hitec City', count: '90+ cars' },
  { city: 'Pune', locations: 'Viman Nagar', count: '110+ cars' },
  { city: 'Chennai', locations: 'T. Nagar', count: '130+ cars' },
  { city: 'Kolkata', locations: 'Park Street', count: '80+ cars' },
  { city: 'Ahmedabad', locations: 'SG Highway', count: '70+ cars' },
]

const stats = [
  { value: '120+', label: 'Cities' },
  { value: '500+', label: 'Pickup points' },
  { value: '24/7', label: 'Availability' },
]

export default function LocationsPage() {
  return (
    <>
      <Seo title="Locations" description="Find RentCar pickup and drop locations across India." />
      <PageHeader
        title="Our Locations"
        subtitle="Self-drive cars available in cities across India with flexible pickup points."
        breadcrumbs={[{ label: 'Home', to: ROUTES.HOME }, { label: 'Locations' }]}
      />
      <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {cities.map((item) => (
              <Grid item key={item.city} xs={12} sm={6} md={3}>
                <MaterialCard sx={{ p: 3, height: '100%' }}>
                  <LocationOnIcon color="primary" sx={{ mb: 1, fontSize: 36 }} />
                  <Typography variant="h6" gutterBottom>
                    {item.city}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.locations}
                  </Typography>
                  <Chip
                    label={item.count}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ mt: 1.5 }}
                  />
                </MaterialCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <StatsBand stats={stats} />
      <Newsletter
        title="We are expanding"
        subtitle="Subscribe to be first to know when we launch in your city."
        onSubmit={(email) => console.log('Locations newsletter:', email)}
      />
    </>
  )
}
