import { useMemo } from 'react'
import { Box, Typography, Rating } from '@mui/material'
import RateReviewIcon from '@mui/icons-material/RateReview'
import { AccountPageShell, ReviewCard } from '@/components/account'
import { useMyReviews, useReviewSummary } from '@/features/reviews'
import EmptyState from '@/components/common/EmptyState'
import MaterialCard from '@/components/ui/MaterialCard'

/**
 * Reviews page — my reviews and rating summary.
 */
function ReviewsPage() {
  const { data: reviewsData, isLoading } = useMyReviews()
  const { data: summaryData } = useReviewSummary()

  const reviews = useMemo(() => reviewsData?.reviews ?? [], [reviewsData])
  const summary = useMemo(() => summaryData ?? { average: 0, total: 0 }, [summaryData])

  return (
    <AccountPageShell title="My Reviews" description="Reviews and ratings you've shared.">
      <MaterialCard sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Your Rating Summary
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Rating value={summary.average} readOnly precision={0.5} />
          <Typography variant="body2" color="text.secondary">
            {summary.average} average · {summary.total} reviews
          </Typography>
        </Box>
      </MaterialCard>

      {isLoading && <Typography variant="body2">Loading reviews…</Typography>}
      {!isLoading && reviews.length === 0 && (
        <EmptyState
          icon={RateReviewIcon}
          title="No reviews yet"
          description="Reviews you write will appear here."
        />
      )}
      <Box>
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </Box>
    </AccountPageShell>
  )
}

export default ReviewsPage
