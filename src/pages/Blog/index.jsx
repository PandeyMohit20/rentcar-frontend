import { Container, Typography } from '@mui/material'
import Seo from '@/components/common/Seo'

/**
 * Blog page — articles and guides.
 */
function BlogPage() {
  return (
    <>
      <Seo title="Blog" description="Articles, guides and car rental tips." />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Blog
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Blog functionality is under construction.
        </Typography>
      </Container>
    </>
  )
}

export default BlogPage
