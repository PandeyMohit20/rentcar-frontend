import TaxBreakdown from '@/features/invoice/TaxBreakdown'
import { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { AccountPageShell } from '@/components/account'
import EmptyState from '@/components/common/EmptyState'
import ImageLazy from '@/components/common/ImageLazy'
import { AccountSkeleton } from '@/components/account/AccountUI'
import MaterialCard from '@/components/ui/MaterialCard'
import LoadingButton from '@/components/buttons/LoadingButton'
import { InvoicePreview } from '@/features/invoice'
import {
  useBookingDetails,
  useBookingInvoice,
  useBookingRefunds,
  useCancelBooking,
} from '@/features/bookings'
import { BOOKING_STATUS_META, PAYMENT_STATUS_META, REFUND_STATUS_META } from '@/features/account'
import { useToast } from '@/contexts/ToastContext'
import { useQueryClient } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { ROUTES } from '@/constants/routes'
import { formatCurrency } from '@/utils/formatters'
import { formatBusinessDateTime } from '@/utils/dateTime'
import cancellationAttemptSession from '@/services/api/cancellationAttemptSession'

const canCancel = (booking) => {
  if (!booking) return false
  const unpaid =
    ['PENDING', 'PAYMENT_PENDING'].includes(booking.status) && booking.paymentStatus !== 'succeeded'
  const paidBeforePickup =
    booking.status === 'CONFIRMED' &&
    booking.paymentStatus === 'succeeded' &&
    new Date(booking.startAt).getTime() > Date.now()
  return unpaid || paidBeforePickup
}

function DetailRow({ label, children }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 0.75 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="body2"
        fontWeight={500}
        textAlign="right"
        sx={{ overflowWrap: 'anywhere' }}
      >
        {children}
      </Typography>
    </Box>
  )
}

DetailRow.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node,
}

function BookingDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useToast()
  const [cancelOpen, setCancelOpen] = useState(false)
  const [reason, setReason] = useState('')
  const bookingQuery = useBookingDetails(id)
  const refundsQuery = useBookingRefunds(id)
  const booking = bookingQuery.data
  const refunds = useMemo(() => refundsQuery.data ?? [], [refundsQuery.data])
  const invoiceEligible = ['succeeded', 'refunded'].includes(booking?.paymentStatus)
  const invoiceQuery = useBookingInvoice(id, invoiceEligible)
  const cancelMutation = useCancelBooking()
  const refundState = refunds
    .map((refund) => `${refund.id}:${refund.status}:${refund.updatedAt || ''}`)
    .join('|')

  useEffect(() => {
    if (!refundState) return
    refunds.forEach((refund) => {
      queryClient.setQueryData(QUERY_KEYS.REFUNDS.DETAILS(refund.id), refund)
    })
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKINGS.MINE })
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKINGS.DETAILS(id) })
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAYMENTS.ALL })
  }, [id, queryClient, refundState, refunds])

  const closeCancelDialog = () => {
    if (!cancelMutation.isPending) setCancelOpen(false)
  }

  const submitCancellation = async () => {
    if (cancelMutation.isPending) return
    const trimmedReason = reason.trim()
    try {
      const result = await cancelMutation.mutateAsync({
        bookingId: id,
        reason: trimmedReason,
        idempotencyKey: cancellationAttemptSession.getOrCreateKey(id),
      })
      cancellationAttemptSession.clear(id)
      setCancelOpen(false)
      setReason('')
      showSuccess(
        result?.refund
          ? 'Booking cancelled. Refund status is shown below.'
          : 'Booking cancelled successfully.'
      )
    } catch (error) {
      showError(
        error?.isNetworkError
          ? 'We could not confirm the cancellation. Your booking status is being refreshed. You can retry safely.'
          : error?.message || 'Cancellation could not be completed.'
      )
    }
  }

  if (bookingQuery.isLoading) {
    return (
      <AccountPageShell title="Booking Details" description="Loading your booking…">
        <AccountSkeleton />
      </AccountPageShell>
    )
  }

  if (bookingQuery.error || !booking) {
    return (
      <AccountPageShell title="Booking Details" description="This booking is unavailable.">
        <MaterialCard>
          <EmptyState
            title="Booking not found"
            description={
              bookingQuery.error?.message || 'The booking could not be found in your account.'
            }
            actionLabel="Back to My Bookings"
            onAction={() => navigate(ROUTES.MY_BOOKINGS)}
          />
        </MaterialCard>
      </AccountPageShell>
    )
  }

  const bookingMeta = BOOKING_STATUS_META[booking.status] ?? {
    label: 'Status unavailable',
    color: 'default',
  }
  const paymentMeta = PAYMENT_STATUS_META[booking.paymentStatus] ?? {
    label: 'Status unavailable',
    color: 'default',
  }
  const cancellationAllowed = canCancel(booking)
  const hasPendingRefund = refunds.some((refund) =>
    ['pending', 'processing'].includes(refund.status)
  )
  const vehicleName = [booking.car?.brand, booking.car?.model].filter(Boolean).join(' ')

  return (
    <AccountPageShell
      title="Booking Details"
      description={booking.bookingNumber}
      actionLabel="My Bookings"
      actionIcon={ArrowBackIcon}
      onAction={() => navigate(ROUTES.MY_BOOKINGS)}
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {booking.car && (
              <MaterialCard sx={{ p: { xs: 2, md: 3 } }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                  {booking.car.primaryImage?.url && (
                    <Box sx={{ width: { xs: '100%', sm: 220 }, flexShrink: 0 }}>
                      <ImageLazy
                        src={booking.car.primaryImage.url}
                        alt={booking.car.primaryImage.altText || vehicleName || 'Booked vehicle'}
                        ratio="16/10"
                      />
                    </Box>
                  )}
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Vehicle
                    </Typography>
                    {vehicleName && (
                      <Typography component="h2" variant="h5" sx={{ mt: 0.5 }}>
                        {vehicleName}
                      </Typography>
                    )}
                    {booking.car.registrationNumber && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Registration: {booking.car.registrationNumber}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </MaterialCard>
            )}
            <MaterialCard sx={{ p: { xs: 2, md: 3 } }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                justifyContent="space-between"
                spacing={1}
                sx={{ mb: 2 }}
              >
                <Box>
                  <Typography variant="h6">Reservation</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Created {formatBusinessDateTime(booking.createdAt)}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Chip label={bookingMeta.label} color={bookingMeta.color} size="small" />
                  <Chip
                    label={paymentMeta.label}
                    color={paymentMeta.color}
                    size="small"
                    variant="outlined"
                  />
                </Stack>
              </Stack>
              <Divider />
              <DetailRow label="Booking number">{booking.bookingNumber}</DetailRow>
              <DetailRow label="Pickup">{formatBusinessDateTime(booking.startAt)}</DetailRow>
              <DetailRow label="Return">{formatBusinessDateTime(booking.endAt)}</DetailRow>
              {booking.holdExpiresAt && (
                <DetailRow label="Payment hold expires">
                  {formatBusinessDateTime(booking.holdExpiresAt)}
                </DetailRow>
              )}
            </MaterialCard>

            <MaterialCard sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Price summary
              </Typography>
              <TaxBreakdown snapshot={booking.financialSnapshot} />
              <DetailRow label="Rental subtotal">
                {formatCurrency(booking.subtotal, booking.currencyCode)}
              </DetailRow>
              <DetailRow label="Security deposit">
                {formatCurrency(booking.securityDeposit, booking.currencyCode)}
              </DetailRow>
              <Divider sx={{ my: 0.5 }} />
              <DetailRow label="Total">
                {formatCurrency(booking.totalAmount, booking.currencyCode)}
              </DetailRow>
            </MaterialCard>

            {(booking.status === 'CANCELLED' || refunds.length > 0 || refundsQuery.error) && (
              <MaterialCard sx={{ p: { xs: 2, md: 3 } }}>
                <Typography variant="h6">Refund status</Typography>
                <Button onClick={() => refundsQuery.refetch()} disabled={refundsQuery.isFetching}>
                  Refresh refund status
                </Button>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Refunds are created by eligible paid cancellations and updated from the payment
                  provider. This view does not initiate refunds.
                </Typography>
                {hasPendingRefund && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    A refund is processing. Automatic checks run briefly; use Refresh refund status
                    for the latest update.
                  </Alert>
                )}
                {refundsQuery.error ? (
                  <Alert
                    severity="error"
                    action={
                      <Button color="inherit" size="small" onClick={() => refundsQuery.refetch()}>
                        Retry
                      </Button>
                    }
                  >
                    {refundsQuery.error.message || 'Refund status could not be loaded.'}
                  </Alert>
                ) : refundsQuery.isLoading ? (
                  <CircularProgress size={24} />
                ) : refunds.length === 0 ? (
                  <Alert severity="info">No refund has been recorded for this booking.</Alert>
                ) : (
                  <Stack spacing={2}>
                    {refunds.map((refund) => {
                      const meta = REFUND_STATUS_META[refund.status] ?? {
                        label: 'Status unavailable',
                        color: 'default',
                      }
                      return (
                        <Box
                          key={refund.id}
                          sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 2 }}
                        >
                          <Stack direction="row" justifyContent="space-between" spacing={2}>
                            <Typography fontWeight={700}>
                              {formatCurrency(refund.amount, refund.currencyCode)}
                            </Typography>
                            <Chip label={meta.label} color={meta.color} size="small" />
                          </Stack>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Requested {formatBusinessDateTime(refund.createdAt)}
                          </Typography>
                          {refund.reason && (
                            <Typography variant="body2">Reason: {refund.reason}</Typography>
                          )}
                          {refund.processedAt && (
                            <Typography variant="body2">
                              Completed {formatBusinessDateTime(refund.processedAt)}
                            </Typography>
                          )}
                          {refund.providerReference && (
                            <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>
                              Provider reference: {refund.providerReference}
                            </Typography>
                          )}
                          {refund.status === 'failed' && (
                            <Alert severity="error" sx={{ mt: 1 }}>
                              {refund.failureReason || 'The refund could not be processed.'}
                              {refund.failedAt && (
                                <Typography variant="caption" component="div" sx={{ mt: 0.5 }}>
                                  Failed {formatBusinessDateTime(refund.failedAt)}
                                </Typography>
                              )}
                            </Alert>
                          )}
                        </Box>
                      )
                    })}
                  </Stack>
                )}
              </MaterialCard>
            )}

            <MaterialCard sx={{ p: { xs: 2, md: 3 } }}>
              {!invoiceEligible ? (
                <Alert severity="info">An invoice is issued after a successful payment.</Alert>
              ) : invoiceQuery.isLoading ? (
                <Box sx={{ py: 3, textAlign: 'center' }}>
                  <CircularProgress size={28} />
                </Box>
              ) : invoiceQuery.error ? (
                <Alert
                  severity={invoiceQuery.error.status === 404 ? 'info' : 'error'}
                  action={
                    invoiceQuery.error.status === 404 ? undefined : (
                      <Button color="inherit" size="small" onClick={() => invoiceQuery.refetch()}>
                        Retry
                      </Button>
                    )
                  }
                >
                  {invoiceQuery.error.status === 404
                    ? 'The invoice has not been issued yet.'
                    : invoiceQuery.error.message || 'The invoice could not be loaded.'}
                </Alert>
              ) : (
                <InvoicePreview invoice={invoiceQuery.data} />
              )}
            </MaterialCard>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <MaterialCard sx={{ p: { xs: 2, md: 3 }, position: { md: 'sticky' }, top: 88 }}>
            <Typography variant="h6">Booking actions</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
              Review the cancellation options available for your booking.
            </Typography>
            {booking.status === 'PAYMENT_PENDING' && booking.paymentStatus === 'pending' && (
              <Button
                variant="contained"
                fullWidth
                sx={{ mb: 1 }}
                onClick={() => navigate(ROUTES.BOOKING_STATUS_WITH_ID(booking.id))}
              >
                View Payment Status
              </Button>
            )}
            <Button
              variant="outlined"
              color="error"
              fullWidth
              disabled={!cancellationAllowed}
              onClick={() => setCancelOpen(true)}
            >
              Cancel Booking
            </Button>
            {!cancellationAllowed && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                {booking.status === 'CANCELLED'
                  ? 'This booking is already cancelled.'
                  : 'Online cancellation is not available for the current booking state.'}
              </Typography>
            )}
          </MaterialCard>
        </Grid>
      </Grid>

      <Dialog
        open={cancelOpen}
        onClose={closeCancelDialog}
        maxWidth="sm"
        fullWidth
        aria-labelledby="cancel-booking-title"
        aria-describedby="cancel-booking-description"
      >
        <DialogTitle id="cancel-booking-title">Cancel booking?</DialogTitle>
        <DialogContent>
          <DialogContentText id="cancel-booking-description" sx={{ mb: 2 }}>
            This action cannot be undone. If an eligible payment was captured, your refund will be
            created automatically.
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={3}
            label="Reason (optional)"
            value={reason}
            onChange={(event) => setReason(event.target.value.slice(0, 500))}
            helperText={`${reason.length}/500 characters`}
            disabled={cancelMutation.isPending}
          />
          {cancelMutation.error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {cancelMutation.error.isNetworkError
                ? 'We could not confirm the cancellation. You can retry safely.'
                : cancelMutation.error.message || 'Cancellation failed.'}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={closeCancelDialog} disabled={cancelMutation.isPending}>
            Keep Booking
          </Button>
          <LoadingButton
            color="error"
            loading={cancelMutation.isPending}
            onClick={submitCancellation}
          >
            Confirm Cancellation
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </AccountPageShell>
  )
}

function BookingDetailsRoute() {
  const { id } = useParams()
  return <BookingDetailsPage key={id} />
}

export default BookingDetailsRoute
