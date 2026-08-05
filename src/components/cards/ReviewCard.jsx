import PropTypes from 'prop-types'
import { Box, Typography, Avatar, Rating } from '@mui/material'
import MaterialCard from '@/components/ui/MaterialCard'
import { initials } from '@/utils/formatters'

/**
 * Customer testimonial card.
 */
function ReviewCard({ review }) {
  const name = review?.name ?? 'Anonymous'
  const firstName = name.split(' ')[0] ?? ''
  const lastName = name.split(' ').slice(1).join(' ') ?? ''

  return (
    <MaterialCard sx={{ height: '100%' }}>
      <Box sx={{ p: 3 }}>
        <Rating value={review?.rating ?? 0} readOnly size="small" sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary" paragraph>
          “{review?.comment}”
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 2 }}>
          <Avatar src={review?.avatar} sx={{ bgcolor: 'primary.main' }}>
            {initials(firstName, lastName)}
          </Avatar>
          <Box>
            <Typography variant="subtitle2">{name}</Typography>
            {review?.meta && (
              <Typography variant="caption" color="text.secondary">
                {review.meta}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </MaterialCard>
  )
}

ReviewCard.propTypes = {
  review: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    rating: PropTypes.number,
    comment: PropTypes.string,
    avatar: PropTypes.string,
    meta: PropTypes.string,
  }),
}

export default ReviewCard
