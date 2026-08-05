import { Box, Container, Grid } from '@mui/material'
import Seo from '@/components/common/Seo'
import PageHeader from '@/components/common/PageHeader'
import SectionTitle from '@/components/sections/SectionTitle'
import BlogCard from '@/components/cards/BlogCard'
import Pagination from '@/components/common/Pagination'
import Newsletter from '@/components/sections/Newsletter'
import { ROUTES } from '@/constants/routes'

const posts = [
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
  {
    id: 4,
    title: '5 Tips for a Smooth Self-Drive Trip',
    excerpt: 'Plan ahead and drive with confidence with these expert tips.',
    category: 'Guides',
    author: 'RentCar Team',
    publishedAt: '2024-12-20',
    slug: '#',
    image:
      'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=600&q=60',
  },
  {
    id: 5,
    title: 'Understanding RentCar Insurance',
    excerpt: 'Everything you need to know about coverage on your rental.',
    category: 'Info',
    author: 'RentCar Team',
    publishedAt: '2024-12-12',
    slug: '#',
    image:
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=60',
  },
  {
    id: 6,
    title: 'Best SUVs for Family Trips',
    excerpt: 'Spacious, comfortable and safe — our top picks for families.',
    category: 'Cars',
    author: 'RentCar Team',
    publishedAt: '2024-12-02',
    slug: '#',
    image:
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=600&q=60',
  },
]

export default function BlogPage() {
  return (
    <>
      <Seo title="Blog" description="Articles, guides and car rental tips from the RentCar team." />
      <PageHeader
        title="Blog"
        subtitle="Tips, destination guides and insights for smarter self-drive travel."
        breadcrumbs={[{ label: 'Home', to: ROUTES.HOME }, { label: 'Blog' }]}
      />
      <Box component="section" sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <SectionTitle
            eyebrow="Latest articles"
            title="From the blog"
            subtitle="Fresh content to help you plan your next journey."
          />
          <Grid container spacing={3} alignItems="stretch">
            {posts.map((post) => (
              <Grid item key={post.id} xs={12} sm={6} md={4}>
                <BlogCard post={post} />
              </Grid>
            ))}
          </Grid>
          <Pagination page={1} count={3} onChange={(page) => console.log('Page', page)} />
        </Container>
      </Box>
      <Newsletter
        title="Subscribe to the blog"
        subtitle="Get the latest articles and travel tips in your inbox."
        onSubmit={(email) => console.log('Blog newsletter:', email)}
      />
    </>
  )
}
