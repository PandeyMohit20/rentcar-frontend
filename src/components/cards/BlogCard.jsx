import PropTypes from 'prop-types'
import { Box, Typography, Chip } from '@mui/material'
import { Link } from 'react-router-dom'
import MaterialCard from '@/components/ui/MaterialCard'
import HoverScale from '@/components/animations/HoverScale'
import { formatDate } from '@/utils/date'

/**
 * Blog article card.
 */
function BlogCard({ post }) {
  const content = (
    <MaterialCard sx={{ height: '100%' }}>
      <Box
        component="img"
        src={post?.image}
        alt={post?.title}
        loading="lazy"
        sx={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
      />
      <Box sx={{ p: 2 }}>
        {post?.category && (
          <Chip label={post.category} color="primary" size="small" sx={{ mb: 1 }} />
        )}
        <Typography variant="h6" gutterBottom>
          {post?.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {post?.excerpt}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {post?.author} • {formatDate(post?.publishedAt)}
        </Typography>
      </Box>
    </MaterialCard>
  )

  const wrapped = post?.slug ? (
    <Link to={post.slug} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      {content}
    </Link>
  ) : (
    content
  )

  return <HoverScale>{wrapped}</HoverScale>
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    excerpt: PropTypes.string,
    image: PropTypes.string,
    category: PropTypes.string,
    author: PropTypes.string,
    publishedAt: PropTypes.string,
    slug: PropTypes.string,
  }),
}

export default BlogCard
