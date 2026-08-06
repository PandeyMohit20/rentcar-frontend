import PropTypes from 'prop-types'
import { Box, Typography } from '@mui/material'
import DataTable from '@/components/tables/DataTable'
import { formatCurrency, formatDate } from '@/utils/formatters'

const columns = [
  { field: 'date', headerName: 'Date', render: (row) => formatDate(row.date) },
  { field: 'description', headerName: 'Description' },
  { field: 'type', headerName: 'Type' },
  {
    field: 'amount',
    headerName: 'Amount',
    align: 'right',
    render: (row) => (
      <Typography color={row.type === 'credit' ? 'success.main' : 'error.main'}>
        {row.type === 'credit' ? '+' : '-'}
        {formatCurrency(row.amount)}
      </Typography>
    ),
  },
  { field: 'status', headerName: 'Status' },
]

/**
 * Wallet transaction history table.
 */
function TransactionTable({ transactions = [], loading = false }) {
  return (
    <Box>
      <DataTable columns={columns} rows={transactions} loading={loading} />
    </Box>
  )
}

TransactionTable.propTypes = {
  transactions: PropTypes.array,
  loading: PropTypes.bool,
}

export default TransactionTable
