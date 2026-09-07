import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import { AccountPageShell, BookingTable } from '@/components/account'
import EmptyState from '@/components/common/EmptyState'
import MaterialCard from '@/components/ui/MaterialCard'
import { useMyBookings } from '@/features/bookings'
import { BOOKING_STATUS_META } from '@/features/account'
import { ROUTES } from '@/constants/routes'

const STATUSES = [
  'PENDING',
  'PAYMENT_PENDING',
  'CONFIRMED',
  'ACTIVE',
  'COMPLETED',
  'CANCELLED',
  'EXPIRED',
  'REJECTED',
]

function BookingsPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const params = useMemo(
    () => ({ page, limit, ...(status ? { status } : {}) }),
    [limit, page, status]
  )
  const bookingsQuery = useMyBookings(params)
  const bookings = bookingsQuery.data?.bookings ?? []
  const meta = bookingsQuery.data?.meta

  const changeStatus = (event) => {
    setStatus(event.target.value)
    setPage(1)
  }

  return (
    <AccountPageShell
      title="My Bookings"
      description="Review your reservations, payment state, cancellations, refunds, and invoices."
    >
      <MaterialCard sx={{ p: { xs: 2, md: 3 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h6">Booking history</Typography>
            <Typography variant="body2" color="text.secondary">
              Open a booking to see its full details.
            </Typography>
          </Box>
          <FormControl size="small" sx={{ minWidth: 210 }}>
            <InputLabel id="booking-status-filter-label">Status</InputLabel>
            <Select
              labelId="booking-status-filter-label"
              value={status}
              label="Status"
              onChange={changeStatus}
            >
              <MenuItem value="">All statuses</MenuItem>
              {STATUSES.map((value) => (
                <MenuItem key={value} value={value}>
                  {BOOKING_STATUS_META[value].label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {bookingsQuery.error ? (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => bookingsQuery.refetch()}>
                Retry
              </Button>
            }
          >
            {bookingsQuery.error.message || 'Your bookings could not be loaded.'}
          </Alert>
        ) : !bookingsQuery.isLoading && bookings.length === 0 ? (
          <EmptyState
            icon={ReceiptLongOutlinedIcon}
            title={
              status
                ? `No ${BOOKING_STATUS_META[status].label.toLowerCase()} bookings`
                : 'No bookings yet'
            }
            description={
              status
                ? 'Try another status filter to find the booking you need.'
                : 'Once you reserve a car, its live status will appear here.'
            }
            actionLabel={status ? 'Clear filter' : 'Find a car'}
            onAction={() => {
              if (status) {
                setStatus('')
                setPage(1)
              } else {
                navigate(ROUTES.SEARCH)
              }
            }}
          />
        ) : (
          <BookingTable
            bookings={bookings}
            loading={bookingsQuery.isLoading || bookingsQuery.isFetching}
            total={meta?.total ?? 0}
            page={Math.max(0, (meta?.page ?? page) - 1)}
            rowsPerPage={meta?.limit ?? limit}
            onPageChange={(_event, nextPage) => setPage(nextPage + 1)}
            onRowsPerPageChange={(event) => {
              setLimit(Number(event.target.value))
              setPage(1)
            }}
            onRowClick={(booking) => navigate(ROUTES.BOOKING_DETAILS_WITH_ID(booking.id))}
          />
        )}
      </MaterialCard>
    </AccountPageShell>
  )
}

export default BookingsPage
