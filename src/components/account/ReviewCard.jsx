import PropTypes from 'prop-types'
import { Box, Button, Chip, Rating, Typography } from '@mui/material'
import MaterialCard from '@/components/ui/MaterialCard'

const STATUS_META = {
  pending: {
    label: 'Pending Moderation',
    color: 'warning',
  },
  approved: {
    label: 'Approved',
    color: 'success',
  },
  rejected: {
    label: 'Rejected',
    color: 'error',
  },
  hidden: {
    label: 'Hidden',
    color: 'default',
  },
}

function ReviewCard({ review = {}, onEdit }) {
  const status = STATUS_META[review.status] ?? {
    label: 'Status unavailable',
    color: 'default',
  }

  const vehicleName =
    [review.car?.brand, review.car?.model].filter(Boolean).join(' ') ||
    review.title ||
    'Review'

  return (
    <MaterialCard sx={{ p: 2, mb: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 2,
          mb: 1,
        }}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            {vehicleName}
          </Typography>

          <Rating
            value={Number(review.rating ?? 0)}
            readOnly
            size="small"
          />
        </Box>

        <Chip
          label={status.label}
          color={status.color}
          size="small"
        />
      </Box>

      {review.comment ? (
        <Typography variant="body2" color="text.secondary">
          {review.comment}
        </Typography>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No comment provided.
        </Typography>
      )}

      {review.status === 'pending' && onEdit && (
        <Box sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => onEdit(review)}
          >
            Edit Review
          </Button>
        </Box>
      )}
    </MaterialCard>
  )
}

ReviewCard.propTypes = {
  review: PropTypes.object,
  onEdit: PropTypes.func,
}

export default ReviewCard

