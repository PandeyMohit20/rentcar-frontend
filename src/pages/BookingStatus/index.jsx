import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import Seo from '@/components/common/Seo'
import MaterialCard from '@/components/ui/MaterialCard'
import LoadingButton from '@/components/buttons/LoadingButton'
import EmptyState from '@/components/common/EmptyState'
import { bookingService, paymentService } from '@/services/modules'
import { useApiMutation, useApiQuery, useQueryClient } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { ROUTES } from '@/constants/routes'
import { formatCurrency } from '@/utils/formatters'
import { formatBusinessDateTime } from '@/utils/dateTime'
import bookingAttemptSession from '@/services/api/bookingAttemptSession'
import loadRazorpay from '@/utils/loadRazorpay'
import { useAuth } from '@/hooks/useAuth'

const TERMINAL_BOOKINGS = new Set([
  'CONFIRMED',
  'ACTIVE',
  'COMPLETED',
  'CANCELLED',
  'EXPIRED',
  'REJECTED',
])

function BookingStatusPage() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const recovery = bookingAttemptSession.getRecovery()
  const validRecovery =
    recovery?.bookingId === bookingId && (!recovery.userId || recovery.userId === user?.id)
  const [paymentId, setPaymentId] = useState(validRecovery ? recovery.paymentId || null : null)
  const [flowMessage, setFlowMessage] = useState('')
  const [flowError, setFlowError] = useState('')
  const [pendingVerification, setPendingVerification] = useState(null)
  const [pollingTimedOut, setPollingTimedOut] = useState(false)
  const [now, setNow] = useState(0)

  const bookingQuery = useApiQuery({
    queryKey: QUERY_KEYS.BOOKINGS.DETAILS(bookingId),
    queryFn: () => bookingService.getBookingById(bookingId),
    enabled: Boolean(bookingId),
    refetchInterval: (query) => {
      const booking = query.state.data
      return !pollingTimedOut && booking && !TERMINAL_BOOKINGS.has(booking.status) ? 4000 : false
    },
  })
  const paymentQuery = useApiQuery({
    queryKey: QUERY_KEYS.PAYMENTS.DETAILS(paymentId),
    queryFn: () => paymentService.getPaymentById(paymentId),
    enabled: Boolean(paymentId),
    refetchInterval: (query) => {
      const payment = query.state.data
      const stopped =
        ['review_required', 'late_payment_conflict'].includes(payment?.operationalStatus) ||
        ['failed', 'refunded'].includes(payment?.status)
      return !pollingTimedOut && payment && !stopped && bookingQuery.data?.status !== 'CONFIRMED'
        ? 4000
        : false
    },
  })

  const refreshTruth = () => {
    bookingQuery.refetch()
    if (paymentId) paymentQuery.refetch()
  }

  const verifyMutation = useApiMutation({
    mutationFn: paymentService.verifyPayment,
    onSuccess: () => {
      setPendingVerification(null)
      setFlowError('')
      setFlowMessage('Payment received. Confirming booking with the payment provider…')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKINGS.DETAILS(bookingId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKINGS.MINE })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INVOICES.FOR_BOOKING(bookingId) })
      if (paymentId)
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAYMENTS.DETAILS(paymentId) })
    },
    onError: (error) => {
      setFlowMessage('Payment status is being checked against backend records.')
      setFlowError(
        error?.isNetworkError
          ? 'Verification response was lost. Do not make another payment.'
          : 'Payment verification could not be completed.'
      )
      refreshTruth()
    },
  })

  const openCheckout = async (order) => {
    try {
      const Razorpay = await loadRazorpay()
      const provider = new Razorpay({
        key: order.keyId,
        order_id: order.payment.providerOrderId,
        currency: order.payment.currencyCode,
        name: 'RentCar',
        description: `Payment for booking ${bookingQuery.data?.bookingNumber || ''}`,
        prefill: { name: user?.name || '', email: user?.email || '', contact: user?.phone || '' },
        handler: (response) => {
          const verification = {
            bookingId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }
          setPendingVerification(verification)
          setFlowMessage('Payment received. Verifying checkout signature…')
          verifyMutation.mutate(verification)
        },
        modal: {
          ondismiss: () => {
            setFlowMessage('Payment was not completed. Backend status has been refreshed.')
            refreshTruth()
          },
        },
      })
      provider.on('payment.failed', () => {
        setFlowError(
          'Razorpay reported that the payment attempt failed. No card details were stored.'
        )
        refreshTruth()
      })
      provider.open()
    } catch (error) {
      setFlowError(error?.message || 'Unable to open Razorpay Checkout.')
    }
  }

  const orderMutation = useApiMutation({
    mutationFn: paymentService.createOrder,
    onSuccess: (order) => {
      const nextPaymentId = order?.payment?.id
      if (!nextPaymentId || !order?.payment?.providerOrderId || !order?.keyId) {
        setFlowError('The payment provider order response was incomplete.')
        return
      }
      bookingAttemptSession.savePayment(nextPaymentId)
      setPaymentId(nextPaymentId)
      queryClient.setQueryData(QUERY_KEYS.PAYMENTS.DETAILS(nextPaymentId), order.payment)
      setFlowError('')
      openCheckout(order)
    },
    onError: (error) =>
      setFlowError(error?.message || 'Unable to create or recover the payment order.'),
  })

  useEffect(() => {
    if (recovery && !validRecovery) bookingAttemptSession.clearRecovery()
  }, [recovery, validRecovery])
  useEffect(() => {
    const updateClock = () => setNow(Date.now())
    const first = window.setTimeout(updateClock, 0)
    const clock = window.setInterval(updateClock, 30000)
    const timeout = window.setTimeout(() => setPollingTimedOut(true), 120000)
    return () => {
      window.clearTimeout(first)
      window.clearInterval(clock)
      window.clearTimeout(timeout)
    }
  }, [])
  useEffect(() => {
    if ([403, 404].includes(bookingQuery.error?.status)) bookingAttemptSession.clearRecovery()
  }, [bookingQuery.error?.status])
  useEffect(() => {
    const status = bookingQuery.data?.status
    if (!status || !TERMINAL_BOOKINGS.has(status)) return
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKINGS.MINE })
    if (status === 'CONFIRMED' && bookingQuery.data?.paymentStatus === 'succeeded') {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INVOICES.FOR_BOOKING(bookingId) })
    }
  }, [bookingId, bookingQuery.data?.paymentStatus, bookingQuery.data?.status, queryClient])

  const booking = bookingQuery.data
  const payment = paymentQuery.data
  const holdMs = booking?.holdExpiresAt ? new Date(booking.holdExpiresAt).getTime() : 0
  const holdExpired = Boolean(holdMs && holdMs <= now)
  const holdMinutes = holdMs > now ? Math.max(1, Math.ceil((holdMs - now) / 60000)) : 0
  const isConfirmed =
    booking?.status === 'CONFIRMED' &&
    booking?.paymentStatus === 'succeeded' &&
    (!payment || (payment.status === 'succeeded' && payment.operationalStatus === 'normal'))
  const isReview = payment?.operationalStatus === 'review_required'
  const isLateConflict = payment?.operationalStatus === 'late_payment_conflict'
  const isExpired = booking?.status === 'EXPIRED' || holdExpired
  const paymentFailed = payment?.status === 'failed'
  const amountMismatch = Boolean(payment && Number(payment.amount) !== Number(booking.totalAmount))
  const canPay =
    booking?.status === 'PAYMENT_PENDING' &&
    booking?.paymentStatus === 'pending' &&
    !isExpired &&
    !isReview &&
    !isLateConflict
  const busy = orderMutation.isPending || verifyMutation.isPending
  const restart = () => {
    const target =
      validRecovery && recovery.returnUrl?.startsWith('/') ? recovery.returnUrl : ROUTES.SEARCH
    bookingAttemptSession.clearAll()
    navigate(target, { replace: true })
  }

  if (bookingQuery.isLoading)
    return (
      <Box sx={{ py: 12, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    )
  if (bookingQuery.error || !booking)
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <EmptyState
          title="Booking unavailable"
          description={bookingQuery.error?.message || 'This booking could not be loaded.'}
          actionLabel="Return to search"
          onAction={() => navigate(ROUTES.SEARCH)}
        />
      </Container>
    )

  return (
    <>
      <Seo
        title={`Booking ${booking.bookingNumber}`}
        description="Booking and payment reconciliation status."
      />
      <Container maxWidth="md" sx={{ py: 6 }}>
        <MaterialCard sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h4">Booking status</Typography>
          <Typography color="text.secondary">{booking.bookingNumber}</Typography>
          {isConfirmed ? (
            <Alert severity="success" sx={{ my: 3 }}>
              Booking confirmed. Backend payment capture and booking reconciliation are complete.
            </Alert>
          ) : isReview ? (
            <Alert severity="warning" sx={{ my: 3 }}>
              Payment was received and is under review. Do not make another payment.
            </Alert>
          ) : isLateConflict ? (
            <Alert severity="error" sx={{ my: 3 }}>
              Payment was received after the booking could no longer be confirmed. Support review is
              required.
            </Alert>
          ) : isExpired ? (
            <Alert severity="warning" sx={{ my: 3 }}>
              Booking hold expired. Payment continuation is disabled.
            </Alert>
          ) : paymentFailed ? (
            <Alert severity="error" sx={{ my: 3 }}>
              The payment attempt failed. You may retry while the booking hold remains valid.
            </Alert>
          ) : (
            <Alert severity="info" sx={{ my: 3 }}>
              {flowMessage ||
                'Booking is awaiting payment or provider reconciliation. It is not confirmed yet.'}
            </Alert>
          )}
          {flowError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {flowError}
            </Alert>
          )}
          {pollingTimedOut && !isConfirmed && !isReview && !isLateConflict && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Payment is still being processed. Automatic polling paused; refresh the status when
              ready.
            </Alert>
          )}
          <Stack spacing={1}>
            <Typography>
              Booking state: <strong>{booking.status}</strong>
            </Typography>
            <Typography>
              Payment state: <strong>{payment?.status || booking.paymentStatus}</strong>
            </Typography>
            {payment?.operationalStatus && (
              <Typography>
                Operational state: <strong>{payment.operationalStatus}</strong>
              </Typography>
            )}
            <Typography>Pickup: {formatBusinessDateTime(booking.startAt)}</Typography>
            <Typography>Return: {formatBusinessDateTime(booking.endAt)}</Typography>
            <Typography>
              Total amount: {formatCurrency(booking.totalAmount, booking.currencyCode)}
            </Typography>
            {payment && (
              <Typography>
                Payment-order amount: {formatCurrency(payment.amount, payment.currencyCode)}
              </Typography>
            )}
            {booking.holdExpiresAt && (
              <Typography>
                Hold expires: {formatBusinessDateTime(booking.holdExpiresAt)}
                {!isExpired && ` (about ${holdMinutes} min remaining)`}
              </Typography>
            )}
          </Stack>
          {amountMismatch && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              The backend payment order differs from the booking snapshot. The payment-order amount
              remains authoritative; status will be reconciled by the backend.
            </Alert>
          )}
          <Divider sx={{ my: 3 }} />
          {canPay && (
            <LoadingButton
              loading={busy}
              disabled={busy}
              onClick={() => orderMutation.mutate(booking.id)}
            >
              {paymentId ? 'Retry / Reopen Payment' : 'Pay Now with Razorpay'}
            </LoadingButton>
          )}
          {pendingVerification && !verifyMutation.isPending && (
            <Button sx={{ ml: 1 }} onClick={() => verifyMutation.mutate(pendingVerification)}>
              Retry Verification
            </Button>
          )}
          <Button sx={{ ml: 1 }} onClick={refreshTruth}>
            Refresh Status
          </Button>
          {(isExpired || booking.status === 'REJECTED' || booking.status === 'CANCELLED') && (
            <Button color="inherit" onClick={restart}>
              Start New Booking
            </Button>
          )}
          {isConfirmed && (
            <>
              <Button
                onClick={() => {
                  bookingAttemptSession.clearRecovery()
                  navigate(ROUTES.BOOKING_DETAILS_WITH_ID(booking.id))
                }}
              >
                View Booking Details
              </Button>
              <Button
                color="inherit"
                onClick={() => {
                  bookingAttemptSession.clearRecovery()
                  navigate(ROUTES.MY_BOOKINGS)
                }}
              >
                My Bookings
              </Button>
            </>
          )}
        </MaterialCard>
      </Container>
    </>
  )
}
export default BookingStatusPage
