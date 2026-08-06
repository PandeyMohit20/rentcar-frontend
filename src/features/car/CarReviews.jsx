import PropTypes from 'prop-types'
import { Box, Typography, Avatar, Rating, Divider } from '@mui/material'
import { formatDate } from '@/utils/date'

/**
 * Car reviews list with rating summary.
 */
function CarReviews({ reviews = [], rating = 0, reviewCount = 0 }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Reviews
      </Typography>
      {reviewCount > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Rating value={rating ?? 0} readOnly />
          <Typography variant="body2" color="text.secondary">
            {rating} / 5 • {reviewCount} reviews
          </Typography>
        </Box>
      )}

      {reviews.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No reviews yet. Be the first to review this car.
        </Typography>
      ) : (
        reviews.map((review) => (
          <Box key={review.id ?? review.user?.name ?? review.title} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar src={review.user?.avatar}>
                {(review.user?.name ?? 'U').charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="subtitle2">{review.user?.name ?? 'User'}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(review.createdAt ?? review.date)}
                </Typography>
              </Box>
              <Rating value={review.rating ?? 0} readOnly size="small" sx={{ ml: 'auto' }} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {review.comment ?? review.text}
            </Typography>
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))
      )}
    </Box>
  )
}

CarReviews.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.object),
  rating: PropTypes.number,
  reviewCount: PropTypes.number,
}

export default CarReviews
