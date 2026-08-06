import PropTypes from 'prop-types'
import { Box, Typography, IconButton, Chip, Stack } from '@mui/material'
import HistoryIcon from '@mui/icons-material/History'
import CloseIcon from '@mui/icons-material/Close'
import { formatDate } from '@/utils/date'
import { useSearchHistory } from './useSearchHistory'

/**
 * Recent search history with clear-all and per-item remove.
 */
function RecentSearches({ onSelect }) {
  const { searches, removeSearch, clearHistory } = useSearchHistory()

  if (searches.length === 0) return null

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle2" gutterBottom>
          <HistoryIcon sx={{ fontSize: 16, verticalAlign: 'text-bottom', mr: 0.5 }} />
          Recent searches
        </Typography>
        <IconButton size="small" aria-label="Clear search history" onClick={clearHistory}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {searches.map((search, index) => (
          <Chip
            key={`${search.location}-${search.pickupDate}-${index}`}
            label={
              search.pickupDate
                ? `${search.location} • ${formatDate(search.pickupDate)}`
                : search.location
            }
            variant="outlined"
            clickable
            onClick={() => onSelect && onSelect(search)}
            onDelete={() => removeSearch(index)}
          />
        ))}
      </Box>
    </Box>
  )
}

RecentSearches.propTypes = {
  onSelect: PropTypes.func,
}

export default RecentSearches
