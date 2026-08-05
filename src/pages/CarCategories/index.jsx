import { Box, Container, Grid, Typography } from '@mui/material'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import SpeedIcon from '@mui/icons-material/Speed'
import ElectricCarIcon from '@mui/icons-material/ElectricCar'
import GroupsIcon from '@mui/icons-material/Groups'
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal'
import Seo from '@/components/common/Seo'
import PageHeader from '@/components/common/PageHeader'
import CategoryCard from '@/components/sections/CategoryCard'
import StatsBand from '@/components/sections/StatsBand'
import Newsletter from '@/components/sections/Newsletter'
import { ROUTES } from '@/constants/routes'

const categories = [
  {
    icon: SpeedIcon,
    title: 'Luxury',
    description: 'Premium sedans and sports cars for that special occasion.',
    to: ROUTES.SEARCH,
  },
  {
    icon: DirectionsCarIcon,
    title: 'SUV',
    description: 'Spacious family and off-road vehicles for any terrain.',
    to: ROUTES.SEARCH,
  },
  {
    icon: ElectricCarIcon,
    title: 'Electric',
    description: 'Silent, zero-emission EVs for a greener drive.',
    to: ROUTES.SEARCH,
  },
  {
    icon: GroupsIcon,
    title: 'Budget',
    description: 'Affordable everyday hatchbacks and sedans.',
    to: ROUTES.SEARCH,
  },
  {
    icon: LocalGasStationIcon,
    title: 'Petrol',
    description: 'Conventional fuel cars with great mileage.',
    to: ROUTES.SEARCH,
  },
  {
    icon: AirlineSeatReclineNormalIcon,
    title: '7-Seater',
    description: 'Roomy people carriers for groups and families.',
    to: ROUTES.SEARCH,
  },
]

const stats = [
  { value: '6+', label: 'Categories' },
  { value: '500+', label: 'Vehicles' },
  { value: '120+', label: 'Cities' },
  { value: '24/7', label: 'Support' },
]

export default function CarCategoriesPage() {
  return (
    <>
      <Seo
        title="Car Categories"
        description="Explore RentCar's fleet by category — luxury, SUV, electric, budget and more."
      />
      <PageHeader
        title="Car Categories"
        subtitle="Browse our fleet by category to find the perfect vehicle for every journey."
        breadcrumbs={[{ label: 'Home', to: ROUTES.HOME }, { label: 'Car Categories' }]}
      />
      <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {categories.map((cat) => (
              <Grid item key={cat.title} xs={12} sm={6} md={4}>
                <CategoryCard
                  icon={cat.icon}
                  title={cat.title}
                  description={cat.description}
                  to={cat.to}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <StatsBand stats={stats} />
      <Newsletter
        title="Find your perfect ride"
        subtitle="Subscribe to get notified about new cars and category launches."
        onSubmit={(email) => console.log('Newsletter signup:', email)}
      />
    </>
  )
}
