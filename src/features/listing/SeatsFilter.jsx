import PropTypes from 'prop-types'
import { Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { SEAT_OPTIONS } from '@/constants/carFilters'

/**
 * Seat capacity filter as toggle buttons.
 */
function SeatsFilter({ value = [], onChange }) {
  const handleChange = (_, next) => onChange && onChange(next ?? [])

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Seats
      </Typography>
      <ToggleButtonGroup
        value={value}
        onChange={handleChange}
        size="small"
        aria-label="Seat capacity"
        sx={{ flexWrap: 'wrap' }}
      >
        {SEAT_OPTIONS.map((seat) => (
          <ToggleButton key={seat} value={seat}>
            {seat}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  )
}

SeatsFilter.propTypes = {
  value: PropTypes.arrayOf(PropTypes.number),
  onChange: PropTypes.func,
}

export default SeatsFilter
