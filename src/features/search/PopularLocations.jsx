import PropTypes from 'prop-types'
import { Box, Chip, Typography } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { POPULAR_LOCATIONS } from './searchConstants'

/**
 * Clickable popular location suggestions.
 */
function PopularLocations({ onSelect }) {
  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Popular locations
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {POPULAR_LOCATIONS.map((location) => (
          <Chip
            key={location}
            icon={<LocationOnIcon />}
            label={location}
            clickable
            onClick={() => onSelect && onSelect(location)}
          />
        ))}
      </Box>
    </Box>
  )
}

PopularLocations.propTypes = {
  onSelect: PropTypes.func,
}

export default PopularLocations
