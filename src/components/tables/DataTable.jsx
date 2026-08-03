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
} from '@mui/material'

/**
 * Generic data table with pagination support.
 */
function DataTable({ columns = [], rows = [], loading = false, pagination = true, ...props }) {
  return (
    <TableContainer component={Paper}>
      <Table size="medium" {...props}>
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
          {rows.length === 0 && !loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, rowIndex) => (
              <TableRow key={row.id || rowIndex}>
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
          count={props.total || rows.length}
          page={props.page || 0}
          onPageChange={props.onPageChange || (() => {})}
          rowsPerPage={props.rowsPerPage || 10}
          onRowsPerPageChange={props.onRowsPerPageChange || (() => {})}
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
}

export default DataTable
