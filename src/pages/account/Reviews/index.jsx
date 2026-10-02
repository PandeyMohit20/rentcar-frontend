import { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
  TextField,
  Typography,
} from '@mui/material'
import RateReviewIcon from '@mui/icons-material/RateReview'
import { AccountPageShell, ReviewCard } from '@/components/account'
import { useMyReviews, useReviewSummary, useUpdateReview } from '@/features/reviews'
import { useToast } from '@/contexts/ToastContext'
import EmptyState from '@/components/common/EmptyState'
import MaterialCard from '@/components/ui/MaterialCard'

function ReviewsPage() {
  const { showSuccess, showError } = useToast()

  const { data: reviewsData, isLoading } = useMyReviews()
  const { data: summaryData } = useReviewSummary()
  const updateReview = useUpdateReview()

  const [editReview, setEditReview] = useState(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const reviews = useMemo(
    () => reviewsData?.reviews ?? [],
    [reviewsData]
  )

  const summary = useMemo(
    () => summaryData ?? { average: 0, total: 0 },
    [summaryData]
  )

  const openEdit = (review) => {
    setEditReview(review)
    setRating(Number(review.rating ?? 0))
    setComment(review.comment ?? '')
  }

  const closeEdit = () => {
    if (!updateReview.isPending) {
      setEditReview(null)
      setRating(0)
      setComment('')
    }
  }

  const handleUpdate = async () => {
    if (!editReview?.id || rating === 0 || updateReview.isPending) return

    try {
      await updateReview.mutateAsync({
        id: editReview.id,
        rating,
        comment: comment.trim(),
      })

      showSuccess('Review updated successfully.')
      closeEdit()
    } catch (error) {
      showError(error?.message || 'Failed to update review.')
    }
  }

  return (
    <AccountPageShell
      title="My Reviews"
      description="Reviews and ratings you've shared."
    >
      <MaterialCard sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Your Rating Summary
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Rating
            value={Number(summary.average ?? 0)}
            readOnly
            precision={0.5}
          />

          <Typography variant="body2" color="text.secondary">
            {Number(summary.average ?? 0).toFixed(1)} average · {summary.total ?? 0} reviews
          </Typography>
        </Box>
      </MaterialCard>

      {isLoading && (
        <Typography variant="body2">
          Loading reviews…
        </Typography>
      )}

      {!isLoading && reviews.length === 0 && (
        <EmptyState
          icon={RateReviewIcon}
          title="No reviews yet"
          description="Reviews you write will appear here."
        />
      )}

      {!isLoading && reviews.length > 0 && (
        <Box>
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onEdit={openEdit}
            />
          ))}
        </Box>
      )}

      <Dialog
        open={Boolean(editReview)}
        onClose={closeEdit}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Edit Review
        </DialogTitle>

        <DialogContent>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            You can edit your review while it is pending moderation.
          </Typography>

          <Rating
            value={rating}
            onChange={(_event, value) => setRating(value ?? 0)}
            size="large"
          />

          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Comment"
            value={comment}
            onChange={(event) =>
              setComment(event.target.value.slice(0, 2000))
            }
            helperText={`${comment.length}/2000 characters`}
            disabled={updateReview.isPending}
            sx={{ mt: 2 }}
          />

          {updateReview.error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {updateReview.error.message || 'Failed to update review.'}
            </Alert>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            color="inherit"
            onClick={closeEdit}
            disabled={updateReview.isPending}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleUpdate}
            disabled={updateReview.isPending || rating === 0}
          >
            {updateReview.isPending ? 'Saving…' : 'Save Review'}
          </Button>
        </DialogActions>
      </Dialog>
    </AccountPageShell>
  )
}

export default ReviewsPage
