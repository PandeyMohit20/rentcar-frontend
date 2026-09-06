import { Box, Grid, CircularProgress } from '@mui/material'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import SpeedIcon from '@mui/icons-material/Speed'
import ElectricCarIcon from '@mui/icons-material/ElectricCar'
import GroupsIcon from '@mui/icons-material/Groups'
import ScheduleIcon from '@mui/icons-material/Schedule'
import ShieldIcon from '@mui/icons-material/Shield'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import PaymentsIcon from '@mui/icons-material/Payments'
import Seo from '@/components/common/Seo'
import CarCard from '@/components/cards/CarCard'
import MembershipCard from '@/components/cards/MembershipCard'
import BlogCard from '@/components/cards/BlogCard'
import EmptyState from '@/components/common/EmptyState'
import Section from '@/components/sections/Section'
import SectionTitle from '@/components/sections/SectionTitle'
import HeroBanner from '@/components/sections/HeroBanner'
import HeroSearchForm from '@/components/sections/HeroSearchForm'
import CategoryCard from '@/components/sections/CategoryCard'
import HowItWorks from '@/components/sections/HowItWorks'
import WhyChoose from '@/components/sections/WhyChoose'
import DownloadApp from '@/components/sections/DownloadApp'
import PartnersRow from '@/components/sections/PartnersRow'
import Newsletter from '@/components/sections/Newsletter'
import { ROUTES } from '@/constants/routes'
import { carService } from '@/services/modules'
import { useApiQuery } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { locationService } from '@/services/modules'
import { useNavigate } from 'react-router-dom'
import { toApiDateTime, validateBusinessInterval } from '@/utils/dateTime'
import { useToast } from '@/contexts/ToastContext'

const heroImage = 'https://wallpaperaccess.com/full/11208.jpg'

const categories = [
  {
    icon: SpeedIcon,
    title: 'Luxury',
    description: 'Premium sedans and sports cars',
    to: ROUTES.CAR_CATEGORIES,
  },
  {
    icon: DirectionsCarIcon,
    title: 'SUV',
    description: 'Spacious family and off-road',
    to: ROUTES.CAR_CATEGORIES,
  },
  {
    icon: ElectricCarIcon,
    title: 'Electric',
    description: 'Eco-friendly zero-emission',
    to: ROUTES.CAR_CATEGORIES,
  },
  {
    icon: GroupsIcon,
    title: 'Budget',
    description: 'Affordable everyday drives',
    to: ROUTES.CAR_CATEGORIES,
  },
]

const steps = [
  {
    title: 'Choose your car',
    description: 'Browse our fleet and pick the car that fits your trip.',
  },
  { title: 'Select dates', description: 'Pick pickup and drop times that work for you.' },
  { title: 'Book instantly', description: 'Confirm your booking in seconds with secure payment.' },
  { title: 'Drive away', description: 'Unlock and drive with insurance and 24/7 support.' },
]

const whyFeatures = [
  {
    icon: ScheduleIcon,
    title: 'Flexible Plans',
    description: 'Hourly, daily, weekly and monthly options to fit any schedule.',
  },
  {
    icon: ShieldIcon,
    title: 'Fully Insured',
    description: 'Every booking includes comprehensive insurance for peace of mind.',
  },
  {
    icon: PaymentsIcon,
    title: 'Transparent Pricing',
    description: 'No hidden charges. Pay only for what you use.',
  },
  {
    icon: SupportAgentIcon,
    title: '24/7 Support',
    description: 'Roadside assistance and human support whenever you need it.',
  },
  {
    icon: LocalOfferIcon,
    title: 'Best Offers',
    description: 'Seasonal deals and membership discounts on every trip.',
  },
]

const membershipPlans = [
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

const blogPosts = [
  {
    id: 1,
    title: 'Top 10 Road Trip Destinations in India',
    excerpt: 'Discover the best scenic routes for your next self-drive adventure.',
    category: 'Travel',
    author: 'RentCar Team',
    publishedAt: '2025-01-10',
    slug: '#',
    image:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=60',
  },
  {
    id: 2,
    title: 'How to Choose the Right Car for Your Trip',
    excerpt: 'A practical guide to picking the perfect vehicle for any journey.',
    category: 'Guides',
    author: 'RentCar Team',
    publishedAt: '2025-01-05',
    slug: '#',
    image:
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=60',
  },
  {
    id: 3,
    title: 'Electric Cars: The Future of Self-Drive',
    excerpt: 'Why going electric with RentCar is easier than you think.',
    category: 'Eco',
    author: 'RentCar Team',
    publishedAt: '2024-12-28',
    slug: '#',
    image:
      'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=600&q=60',
  },
]

/**
 * Home page — premium landing experience.
 */
function HomePage() {
  const navigate = useNavigate()
  const { showError } = useToast()
  const { data, isLoading, error, refetch } = useApiQuery({
    queryKey: QUERY_KEYS.CARS.FEATURED,
    queryFn: carService.getFeaturedCars,
  })

  const {
    data: branchData,
    isLoading: branchesLoading,
    error: branchesError,
    refetch: refetchBranches,
  } = useApiQuery({
    queryKey: QUERY_KEYS.LOCATIONS.BRANCHES,
    queryFn: locationService.getBranches,
  })
  const featuredCars = data?.cars ?? []
  const branches = (branchData?.items ?? []).map((branch) => ({
    id: branch.id,
    label: [branch.name, branch.city].filter(Boolean).join(', '),
  }))
  const handleSearch = ({ branchId, pickupDate, pickupTime, returnDate, returnTime, brand }) => {
    const params = new URLSearchParams()
    if (branchId) params.set('branchId', branchId)
    if (brand) params.set('brand', brand)
    const hasAnyInterval = pickupDate || pickupTime || returnDate || returnTime
    if (hasAnyInterval) {
      const pickup = toApiDateTime(pickupDate, pickupTime)
      const returnValue = toApiDateTime(returnDate, returnTime)
      const intervalError = validateBusinessInterval(pickup, returnValue)
      if (intervalError) return showError(intervalError)
      params.set('pickup', pickup)
      params.set('return', returnValue)
    }
    navigate(`${ROUTES.SEARCH}?${params}`)
  }

  return (
    <>
      <Seo
        title="Home"
        description="Book self-drive cars on demand with flexible plans. Enterprise car rental platform."
        image={heroImage}
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <HeroBanner
        title="Rent a Car, Anywhere"
        subtitle="Book self-drive cars on demand with flexible plans and transparent pricing."
        image={heroImage}
        height={620}
      >
        {branchesLoading ? (
          <CircularProgress color="inherit" />
        ) : branchesError ? (
          <EmptyState
            title="Unable to load pickup locations"
            description="Please retry."
            actionLabel="Retry"
            onAction={refetchBranches}
          />
        ) : (
          <HeroSearchForm locations={branches} categories={[]} onSearch={handleSearch} />
        )}
      </HeroBanner>

      {/* ── Categories ───────────────────────────────────────────────── */}
      <Section>
        <SectionTitle
          eyebrow="Browse by category"
          title="Choose the right car for you"
          subtitle="From luxury sedans to budget hatchbacks, find the perfect vehicle for every journey."
        />
        <Grid container spacing={3}>
          {categories.map((cat) => (
            <Grid item key={cat.title} xs={12} sm={6} md={3}>
              <CategoryCard
                icon={cat.icon}
                title={cat.title}
                description={cat.description}
                to={cat.to}
              />
            </Grid>
          ))}
        </Grid>
      </Section>

      {/* ── Featured cars ────────────────────────────────────────────── */}
      <Section bgcolor="background.paper">
        <SectionTitle
          eyebrow="Featured fleet"
          title="Featured Cars"
          subtitle="Our most popular and highly-rated vehicles, ready for your next trip."
        />
        {isLoading ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <EmptyState
            title="Unable to load cars"
            description="We couldn't load featured cars right now. Please try again later."
            actionLabel="Retry"
            onAction={refetch}
          />
        ) : featuredCars.length === 0 ? (
          <EmptyState title="No cars available" description="Check back soon for new cars." />
        ) : (
          <Grid container spacing={3}>
            {featuredCars.map((car) => (
              <Grid item key={car.id} xs={12} sm={6} md={4}>
                <CarCard car={car} />
              </Grid>
            ))}
          </Grid>
        )}
      </Section>

      {/* ── Stats ────────────────────────────────────────────────────── */}

      {/* ── How it works ─────────────────────────────────────────────── */}
      <Section>
        <HowItWorks eyebrow="Simple process" title="How it works" steps={steps} />
      </Section>

      {/* ── Why choose ───────────────────────────────────────────────── */}
      <Section bgcolor="background.paper">
        <WhyChoose
          eyebrow="Why RentCar"
          title="Drive with confidence"
          subtitle="We've built the platform around flexibility, transparency and support."
          features={whyFeatures}
        />
      </Section>

      {/* ── Membership ───────────────────────────────────────────────── */}
      <Section>
        <SectionTitle
          eyebrow="Membership"
          title="Plans that fit your lifestyle"
          subtitle="Unlock exclusive perks with our membership plans."
        />
        <Grid container spacing={3} alignItems="stretch">
          {membershipPlans.map((plan) => (
            <Grid item key={plan.name} xs={12} md={4}>
              <MembershipCard plan={plan} featured={plan.featured} />
            </Grid>
          ))}
        </Grid>
      </Section>

      {/* ── Reviews ──────────────────────────────────────────────────── */}
      {/* ── Latest blogs ─────────────────────────────────────────────── */}
      <Section>
        <SectionTitle
          eyebrow="From the blog"
          title="Latest articles & guides"
          subtitle="Tips, destination guides and car rental insights."
        />
        <Grid container spacing={3} alignItems="stretch">
          {blogPosts.map((post) => (
            <Grid item key={post.id} xs={12} sm={6} md={4}>
              <BlogCard post={post} />
            </Grid>
          ))}
        </Grid>
      </Section>

      {/* ── Partners ─────────────────────────────────────────────────── */}
      <PartnersRow partners={['Maruti', 'Hyundai', 'Tata', 'Mahindra', 'Toyota', 'Honda']} />

      {/* ── Download app ─────────────────────────────────────────────── */}
      <DownloadApp
        title="Get the RentCar app"
        subtitle="Book cars, manage trips and unlock exclusive app-only deals — all from your pocket."
      />

      {/* ── Newsletter ───────────────────────────────────────────────── */}
      <Newsletter
        title="Stay in the loop"
        subtitle="Subscribe for exclusive offers, new cars and travel tips."
        onSubmit={() => {}}
      />
    </>
  )
}

export default HomePage
