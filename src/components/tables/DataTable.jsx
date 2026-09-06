import PropTypes from 'prop-types'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  CircularProgress,
} from '@mui/material'

/**
 * Generic data table with pagination support.
 */
function DataTable({
  columns = [],
  rows = [],
  loading = false,
  pagination = true,
  total,
  page = 0,
  onPageChange,
  rowsPerPage = 10,
  onRowsPerPageChange,
  onRowClick,
  sx,
}) {
  return (
    <TableContainer component={Paper}>
      <Table size="medium" sx={sx}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.field} align={column.align || 'left'}>
                {column.headerName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                <CircularProgress size={28} aria-label="Loading" />
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, rowIndex) => (
              <TableRow
                key={row.id || rowIndex}
                hover={Boolean(onRowClick)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={
                  onRowClick
                    ? (event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          onRowClick(row)
                        }
                      }
                    : undefined
                }
              >
                {columns.map((column) => (
                  <TableCell key={column.field} align={column.align || 'left'}>
                    {column.render ? column.render(row) : row[column.field]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {pagination && (
        <TablePagination
          component="div"
          count={total ?? rows.length}
          page={page}
          onPageChange={onPageChange || (() => {})}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange || (() => {})}
        />
      )}
    </TableContainer>
  )
}

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      headerName: PropTypes.string.isRequired,
      align: PropTypes.string,
      render: PropTypes.func,
    })
  ),
  rows: PropTypes.array,
  loading: PropTypes.bool,
  pagination: PropTypes.bool,
  total: PropTypes.number,
  page: PropTypes.number,
  onPageChange: PropTypes.func,
  rowsPerPage: PropTypes.number,
  onRowsPerPageChange: PropTypes.func,
  onRowClick: PropTypes.func,
  sx: PropTypes.object,
}

export default DataTable
