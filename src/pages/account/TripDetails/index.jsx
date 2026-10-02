import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Grid,
  Rating,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { AccountPageShell, TripTimeline } from '@/components/account'
import { useBookingDetails } from '@/features/bookings'
import { useMyReviews, useCreateReview } from '@/features/reviews'
import { useToast } from '@/contexts/ToastContext'
import MaterialCard from '@/components/ui/MaterialCard'
import { formatCurrency } from '@/utils/formatters'
import { formatBusinessDateTime } from '@/utils/dateTime'
import { ROUTES } from '@/constants/routes'

function TripDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()

  const bookingQuery = useBookingDetails(id)
  const reviewsQuery = useMyReviews({ limit: 100 })
  const createReview = useCreateReview()

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const booking = bookingQuery.data

  const events = useMemo(() => {
    if (Array.isArray(booking?.timeline)) return booking.timeline
    return []
  }, [booking])

  const existingReview = useMemo(() => {
    const reviews = reviewsQuery.data?.reviews ?? []
    return reviews.find((review) => review.bookingId === id) ?? null
  }, [reviewsQuery.data, id])

  const canReview = booking?.status === 'COMPLETED'
  const reviewPending = existingReview?.status === 'pending'
  const reviewApproved = existingReview?.status === 'approved'
  const reviewRejected = existingReview?.status === 'rejected'
  const reviewHidden = existingReview?.status === 'hidden'

  const handleSubmitReview = async () => {
    if (!id || !canReview || rating === 0 || createReview.isPending) return

    try {
      await createReview.mutateAsync({
        bookingId: id,
        rating,
        comment: comment.trim(),
      })

      setRating(0)
      setComment('')

      showSuccess('Review submitted for moderation.')
    } catch (error) {
      showError(error?.message || 'Failed to submit review.')
    }
  }

  if (bookingQuery.isLoading) {
    return (
      <AccountPageShell title="Trip Details" description="Loading your trip…">
        <MaterialCard sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Loading booking details…
          </Typography>
        </MaterialCard>
      </AccountPageShell>
    )
  }

  if (bookingQuery.error || !booking) {
    return (
      <AccountPageShell
        title="Trip Details"
        description="This booking is unavailable."
        actionLabel="My Bookings"
        actionIcon={ArrowBackIcon}
        onAction={() => navigate(ROUTES.MY_BOOKINGS)}
      >
        <MaterialCard sx={{ p: 3 }}>
          <Alert severity="error">
            {bookingQuery.error?.message || 'The booking could not be found.'}
          </Alert>
        </MaterialCard>
      </AccountPageShell>
    )
  }

  return (
    <AccountPageShell
      title="Trip Details"
      description={booking.bookingNumber || `Booking ${id}`}
      actionLabel="My Bookings"
      actionIcon={ArrowBackIcon}
      onAction={() => navigate(ROUTES.MY_BOOKINGS)}
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            <MaterialCard sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" gutterBottom>
                Trip Details
              </Typography>

              {booking.car && (
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {[booking.car.brand, booking.car.model].filter(Boolean).join(' ')}
                </Typography>
              )}

              <Typography variant="body2" color="text.secondary">
                Pickup: {formatBusinessDateTime(booking.startAt)}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Return: {formatBusinessDateTime(booking.endAt)}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Status: {booking.status}
              </Typography>
            </MaterialCard>

            <TripTimeline events={events} />

            <MaterialCard sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Trip Cost
              </Typography>

              <Typography variant="h4" color="primary">
                {formatCurrency(
                  booking.totalAmount ?? booking.cost ?? 0,
                  booking.currencyCode
                )}
              </Typography>
            </MaterialCard>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            <MaterialCard sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" gutterBottom>
                Write a Review
              </Typography>

              {!canReview && (
                <Alert severity="info">
                  You can write a review after this trip is completed.
                </Alert>
              )}

              {canReview && reviewsQuery.isLoading && (
                <Typography variant="body2" color="text.secondary">
                  Checking your review…
                </Typography>
              )}

              {canReview && !reviewsQuery.isLoading && existingReview && (
                <Alert
                  severity={
                    reviewPending
                      ? 'info'
                      : reviewApproved
                        ? 'success'
                        : reviewRejected
                          ? 'warning'
                          : 'info'
                  }
                >
                  {reviewPending && 'Your review is pending moderation.'}
                  {reviewApproved && 'Your review has been approved.'}
                  {reviewRejected && 'Your review was rejected by moderation.'}
                  {reviewHidden && 'Your review is currently hidden.'}
                </Alert>
              )}

              {canReview &&
                !reviewsQuery.isLoading &&
                !existingReview && (
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Rating
                      </Typography>

                      <Rating
                        value={rating}
                        onChange={(_event, value) => setRating(value ?? 0)}
                        size="large"
                      />
                    </Box>

                    <TextField
                      fullWidth
                      multiline
                      minRows={4}
                      label="Comment"
                      placeholder="Tell us about your rental experience…"
                      value={comment}
                      onChange={(event) =>
                        setComment(event.target.value.slice(0, 2000))
                      }
                      helperText={`${comment.length}/2000 characters`}
                      disabled={createReview.isPending}
                    />

                    {createReview.error && (
                      <Alert severity="error">
                        {createReview.error.message || 'Failed to submit review.'}
                      </Alert>
                    )}

                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleSubmitReview}
                      disabled={
                        createReview.isPending ||
                        rating === 0
                      }
                    >
                      {createReview.isPending
                        ? 'Submitting…'
                        : 'Submit Review'}
                    </Button>
                  </Stack>
                )}
            </MaterialCard>

            <MaterialCard sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" gutterBottom>
                Invoice
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {booking.status === 'COMPLETED'
                  ? 'Your invoice is available from the booking details page.'
                  : 'Invoice will be available after successful payment.'}
              </Typography>
            </MaterialCard>
          </Stack>
        </Grid>
      </Grid>
    </AccountPageShell>
  )
}

export default TripDetailsPage
