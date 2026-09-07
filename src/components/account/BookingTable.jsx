import { Box, Button, Chip, Stack, TablePagination, Typography, useMediaQuery } from '@mui/material'
import DataTable from '@/components/tables/DataTable'
import { AccountSkeleton } from './AccountUI'
import { formatCurrency } from '@/utils/formatters'
import { formatBusinessDateTime } from '@/utils/dateTime'
import { BOOKING_STATUS_META, PAYMENT_STATUS_META } from '@/features/account'

function Status({ value, payment = false }) {
  const meta = (payment ? PAYMENT_STATUS_META : BOOKING_STATUS_META)[value] || {
    label: value || 'Unavailable',
    color: 'default',
  }
  return (
    <Chip
      label={meta.label}
      color={meta.color}
      size="small"
      variant={payment ? 'outlined' : 'filled'}
    />
  )
}
function TripDates({ booking }) {
  return (
    <Stack>
      <Typography variant="body2">
        {formatBusinessDateTime(booking.startAt || booking.startDate)}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        to {formatBusinessDateTime(booking.endAt || booking.endDate)}
      </Typography>
    </Stack>
  )
}
function BookingTable({
  bookings = [],
  loading = false,
  onRowClick,
  total,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) {
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('lg'))
  const columns = [
    {
      field: 'bookingNumber',
      headerName: 'Booking',
      render: (row) => (
        <Typography variant="body2" fontWeight={700} sx={{ overflowWrap: 'anywhere' }}>
          {row.bookingNumber || 'Booking'}
        </Typography>
      ),
    },
    { field: 'startAt', headerName: 'Trip', render: (row) => <TripDates booking={row} /> },
    {
      field: 'totalAmount',
      headerName: 'Amount',
      align: 'right',
      render: (row) => formatCurrency(row.totalAmount, row.currencyCode),
    },
    { field: 'status', headerName: 'Status', render: (row) => <Status value={row.status} /> },
    {
      field: 'paymentStatus',
      headerName: 'Payment',
      render: (row) => <Status value={row.paymentStatus} payment />,
    },
    {
      field: 'action',
      headerName: 'Details',
      render: (row) => (
        <Button
          size="small"
          onClick={(event) => {
            event.stopPropagation()
            onRowClick(row)
          }}
          onKeyDown={(event) => event.stopPropagation()}
          aria-label={'View booking ' + (row.bookingNumber || 'details')}
        >
          View details
        </Button>
      ),
    },
  ]
  if (loading) return <AccountSkeleton />
  if (!mobile)
    return (
      <Box
        role="region"
        aria-label="Booking history"
        tabIndex={0}
        sx={{ overflowX: 'auto', maxWidth: '100%' }}
      >
        <DataTable
          columns={columns}
          rows={bookings}
          onRowClick={onRowClick}
          total={total}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          sx={{ minWidth: 800, cursor: 'pointer' }}
        />
      </Box>
    )
  return (
    <Stack spacing={2}>
      {bookings.map((booking) => (
        <Box key={booking.id} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 2 }}>
          <Stack spacing={2}>
            <Typography fontWeight={700} sx={{ overflowWrap: 'anywhere' }}>
              {booking.bookingNumber || 'Booking'}
            </Typography>
            <Stack direction="row" gap={1} flexWrap="wrap">
              <Status value={booking.status} />
              <Status value={booking.paymentStatus} payment />
            </Stack>
            <TripDates booking={booking} />
            <Typography fontWeight={700}>
              {formatCurrency(booking.totalAmount, booking.currencyCode)}
            </Typography>
            <Button variant="outlined" onClick={() => onRowClick(booking)}>
              View details
            </Button>
          </Stack>
        </Box>
      ))}
      <TablePagination
        component="div"
        count={total ?? bookings.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        sx={{
          '& .MuiTablePagination-toolbar': { flexWrap: 'wrap', px: 0, justifyContent: 'center' },
          '& .MuiTablePagination-spacer': { display: 'none' },
          '& .MuiTablePagination-actions': { ml: 0 },
        }}
      />
    </Stack>
  )
}
export default BookingTable
