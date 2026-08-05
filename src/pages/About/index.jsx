import { Box, Container, Typography, Grid, CircularProgress } from '@mui/material'
import Seo from '@/components/common/Seo'
import FeatureCard from '@/components/cards/FeatureCard'
import EmptyState from '@/components/common/EmptyState'
import { contentService } from '@/services/modules'
import { useApiQuery } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { pageStyles } from './styles'

/**
 * About page — company story, mission and values.
 */
function AboutPage() {
  const { data, isLoading, error } = useApiQuery({
    queryKey: QUERY_KEYS.CONTENT.ABOUT,
    queryFn: contentService.getAboutContent,
  })

  const content = data?.data ?? data

  if (isLoading) {
    return (
      <Box sx={{ py: 12, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <>
        <Seo title="About Us" description="About RentCar." />
        <Container maxWidth="lg" sx={pageStyles.container}>
          <EmptyState title="Unable to load content" description="Please try again later." />
        </Container>
      </>
    )
  }

  return (
    <>
      <Seo title="About Us" description="Learn more about RentCar and our mission." />
      <Container maxWidth="lg" sx={pageStyles.container}>
        <Box sx={pageStyles.hero}>
          <Typography variant="h3" gutterBottom>
            {content?.title ?? 'About RentCar'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            {content?.description ??
              'We are on a mission to make self-drive car rentals simple, transparent and accessible to everyone.'}
          </Typography>
        </Box>

        <Box sx={pageStyles.section}>
          <Typography variant="h4" gutterBottom>
            Our Values
          </Typography>
          <Grid container spacing={3}>
            {(
              content?.values ?? [
                { title: 'Trust', description: 'We build trust through transparency.' },
                { title: 'Customer First', description: 'Your satisfaction is our priority.' },
                { title: 'Innovation', description: 'We constantly improve the experience.' },
              ]
            ).map((value) => (
              <Grid item key={value.title} xs={12} md={4}>
                <FeatureCard title={value.title} description={value.description} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </>
  )
}

export default AboutPage
