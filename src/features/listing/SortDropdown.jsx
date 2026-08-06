import PropTypes from 'prop-types'
import { Box, MenuItem, TextField } from '@mui/material'
import SortIcon from '@mui/icons-material/Sort'
import { SORT_OPTIONS } from '@/constants/carFilters'

/**
 * Sort select for search results.
 */
function SortDropdown({ value = '', onChange }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 220 }}>
      <SortIcon color="action" />
      <TextField
        select
        label="Sort by"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        size="small"
        fullWidth
      >
        <MenuItem value="">Recommended</MenuItem>
        {SORT_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  )
}

SortDropdown.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
}

export default SortDropdown
