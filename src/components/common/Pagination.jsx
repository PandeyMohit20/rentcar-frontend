import PropTypes from 'prop-types'
import { Box, Pagination as MuiPagination } from '@mui/material'

/**
 * Reusable pagination control.
 */
function Pagination({ page = 1, count = 1, onChange }) {
  if (!count || count <= 1) return null

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <MuiPagination
        page={page}
        count={count}
        color="primary"
        shape="rounded"
        onChange={(_, value) => onChange && onChange(value)}
      />
    </Box>
  )
}

Pagination.propTypes = {
  page: PropTypes.number,
  count: PropTypes.number,
  onChange: PropTypes.func,
}

export default Pagination
