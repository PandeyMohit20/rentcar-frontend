import PropTypes from 'prop-types'
import { Box, Chip } from '@mui/material'
import DataTable from '@/components/tables/DataTable'
import { formatCurrency, formatDate } from '@/utils/formatters'

const statusColor = (status) => {
  switch (status) {
    case 'confirmed':
      return 'success'
    case 'completed':
      return 'info'
    case 'cancelled':
      return 'error'
    case 'refunded':
      return 'warning'
    case 'upcoming':
      return 'primary'
    default:
      return 'default'
  }
}

const columns = [
  { field: 'id', headerName: 'Booking ID' },
  {
    field: 'car',
    headerName: 'Car',
    render: (row) => (row.car ? `${row.car.brand} ${row.car.model}` : '—'),
  },
  { field: 'startDate', headerName: 'Start', render: (row) => formatDate(row.startDate) },
  { field: 'endDate', headerName: 'End', render: (row) => formatDate(row.endDate) },
  {
    field: 'totalAmount',
    headerName: 'Amount',
    align: 'right',
    render: (row) => formatCurrency(row.totalAmount),
  },
  {
    field: 'status',
    headerName: 'Status',
    render: (row) => <Chip label={row.status} color={statusColor(row.status)} size="small" />,
  },
]

/**
 * Bookings listing table.
 */
function BookingTable({ bookings = [], loading = false, onRowClick }) {
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <DataTable
        columns={columns}
        rows={bookings}
        loading={loading}
        onRowClick={onRowClick}
        sx={{ cursor: 'pointer' }}
      />
    </Box>
  )
}

BookingTable.propTypes = {
  bookings: PropTypes.array,
  loading: PropTypes.bool,
}

export default BookingTable
