import PropTypes from 'prop-types'
import { Box, Chip, Stack, Typography } from '@mui/material'
import DataTable from '@/components/tables/DataTable'
import { formatCurrency } from '@/utils/formatters'
import { formatBusinessDateTime } from '@/utils/dateTime'
import { BOOKING_STATUS_META, PAYMENT_STATUS_META } from '@/features/account'

const columns = [
  {
    field: 'bookingNumber',
    headerName: 'Booking',
    render: (row) => (
      <Stack>
        <Typography variant="body2" fontWeight={700}>
          {row.bookingNumber || row.id || '—'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {row.car ? `${row.car.brand} ${row.car.model}` : `Car ${row.carId || '—'}`}
        </Typography>
      </Stack>
    ),
  },
  {
    field: 'startAt',
    headerName: 'Trip',
    render: (row) => (
      <Stack>
        <Typography variant="body2">
          {formatBusinessDateTime(row.startAt || row.startDate)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          to {formatBusinessDateTime(row.endAt || row.endDate)}
        </Typography>
      </Stack>
    ),
  },
  {
    field: 'totalAmount',
    headerName: 'Amount',
    align: 'right',
    render: (row) => formatCurrency(row.totalAmount, row.currencyCode),
  },
  {
    field: 'status',
    headerName: 'Status',
    render: (row) => {
      const meta = BOOKING_STATUS_META[row.status] ?? { label: row.status, color: 'default' }
      return <Chip label={meta.label} color={meta.color} size="small" />
    },
  },
  {
    field: 'paymentStatus',
    headerName: 'Payment',
    render: (row) => {
      const meta = PAYMENT_STATUS_META[row.paymentStatus] ?? {
        label: row.paymentStatus || '—',
        color: 'default',
      }
      return <Chip label={meta.label} color={meta.color} size="small" variant="outlined" />
    },
  },
]

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
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <DataTable
        columns={columns}
        rows={bookings}
        loading={loading}
        onRowClick={onRowClick}
        total={total}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
      />
    </Box>
  )
}

BookingTable.propTypes = {
  bookings: PropTypes.array,
  loading: PropTypes.bool,
  onRowClick: PropTypes.func,
  total: PropTypes.number,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
}

export default BookingTable
