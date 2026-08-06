import PropTypes from 'prop-types'
import { Box, Typography, Rating } from '@mui/material'
import MaterialCard from '@/components/ui/MaterialCard'

/**
 * Review card with rating.
 */
function ReviewCard({ review = {} }) {
  return (
    <MaterialCard sx={{ p: 2, mb: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="subtitle2">{review.car?.model ?? review.title ?? 'Review'}</Typography>
        <Rating value={review.rating ?? 0} readOnly size="small" />
      </Box>
      <Typography variant="body2" color="text.secondary">
        {review.comment}
      </Typography>
    </MaterialCard>
  )
}

ReviewCard.propTypes = {
  review: PropTypes.object,
}

export default ReviewCard
