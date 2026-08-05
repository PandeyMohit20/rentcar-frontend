import { Box, Container, Grid, Typography } from '@mui/material'
import Seo from '@/components/common/Seo'
import PageHeader from '@/components/common/PageHeader'
import SectionTitle from '@/components/sections/SectionTitle'
import MembershipCard from '@/components/cards/MembershipCard'
import HowItWorks from '@/components/sections/HowItWorks'
import Newsletter from '@/components/sections/Newsletter'
import { ROUTES } from '@/constants/routes'
import { useToast } from '@/contexts/ToastContext'

const plans = [
  {
    name: 'Starter',
    price: '₹0',
    period: 'month',
    description: 'Pay as you go',
    features: ['Access to budget cars', 'Standard insurance', 'Email support'],
  },
  {
    name: 'Pro',
    price: '₹999',
    period: 'month',
    description: 'For frequent travellers',
    features: ['All car categories', 'Priority booking', '10% off every trip', '24/7 support'],
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For businesses',
    features: ['Dedicated fleet', 'Corporate billing', 'Account manager'],
  },
]

const steps = [
  {
    title: 'Pick a plan',
    description: 'Whether you drive weekly or monthly, there is a plan for you.',
  },
  {
    title: 'Complete signup',
    description: 'Create your account and verify your documents securely.',
  },
  {
    title: 'Start saving',
    description: 'Unlock instant discounts and priority access on every trip.',
  },
]

export default function MembershipPage() {
  const { showSuccess } = useToast()

  const handleSelect = (plan) => {
    showSuccess(`${plan.name} plan selected. We will contact you shortly.`)
  }

  return (
    <>
      <Seo
        title="Membership"
        description="Explore RentCar membership plans and unlock exclusive discounts and perks."
      />
      <PageHeader
        title="Membership Plans"
        subtitle="Choose a plan that fits your travel habits and unlock exclusive benefits."
        breadcrumbs={[{ label: 'Home', to: ROUTES.HOME }, { label: 'Membership' }]}
      />
      <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <SectionTitle
            eyebrow="Membership"
            title="Plans & pricing"
            subtitle="Simple, transparent pricing with no hidden fees."
          />
          <Grid container spacing={3} alignItems="stretch">
            {plans.map((plan) => (
              <Grid item key={plan.name} xs={12} md={4}>
                <MembershipCard plan={plan} featured={plan.featured} onSelect={handleSelect} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Box component="section" sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <HowItWorks eyebrow="Getting started" title="Join in three simple steps" steps={steps} />
        </Container>
      </Box>
      <Newsletter
        title="Get membership updates"
        subtitle="Subscribe to hear about new plans and exclusive member offers."
        onSubmit={(email) => console.log('Membership newsletter:', email)}
      />
    </>
  )
}
