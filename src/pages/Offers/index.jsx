import { Box, Container, Grid } from '@mui/material'
import Seo from '@/components/common/Seo'
import PageHeader from '@/components/common/PageHeader'
import SectionTitle from '@/components/sections/SectionTitle'
import OfferCard from '@/components/cards/OfferCard'
import Newsletter from '@/components/sections/Newsletter'
import { ROUTES } from '@/constants/routes'

const offers = [
  {
    id: 1,
    title: 'Weekend Special',
    discount: '20% OFF',
    subtitle: 'On all SUV rentals every weekend',
    code: 'WEEKEND20',
  },
  {
    id: 2,
    title: 'First Trip',
    discount: '₹500 OFF',
    subtitle: 'On your very first booking with RentCar',
    code: 'FIRST500',
  },
  {
    id: 3,
    title: 'Long Term',
    discount: '30% OFF',
    subtitle: 'On weekly and monthly rentals',
    code: 'MONTH30',
  },
  {
    id: 4,
    title: 'Electric Deals',
    discount: '15% OFF',
    subtitle: 'On all electric car rentals',
    code: 'EV15',
  },
]

export default function OffersPage() {
  return (
    <>
      <Seo
        title="Offers"
        description="Explore current promotional offers and coupons for RentCar bookings."
      />
      <PageHeader
        title="Offers & Coupons"
        subtitle="Save on your next drive with exclusive deals and promo codes."
        breadcrumbs={[{ label: 'Home', to: ROUTES.HOME }, { label: 'Offers' }]}
      />
      <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <SectionTitle
            eyebrow="Limited time"
            title="Current promotions"
            subtitle="Apply these codes at checkout to unlock instant savings."
          />
          <Grid container spacing={3}>
            {offers.map((offer) => (
              <Grid item key={offer.id} xs={12} sm={6} md={3}>
                <OfferCard offer={offer} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Newsletter
        title="Never miss a deal"
        subtitle="Subscribe to get new offers and promo codes before anyone else."
        onSubmit={(email) => console.log('Offers newsletter:', email)}
      />
    </>
  )
}
