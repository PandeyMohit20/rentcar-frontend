import PropTypes from 'prop-types'
import { Box, Typography, FormGroup, FormControlLabel, Checkbox } from '@mui/material'
import { AMENITY_OPTIONS } from '@/constants/carFilters'

/**
 * Multi-select amenities filter.
 */
function AmenityFilter({ value = [], onChange }) {
  const toggle = (val) => {
    const next = value.includes(val) ? value.filter((v) => v !== val) : [...value, val]
    onChange && onChange(next)
  }

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Amenities
      </Typography>
      <FormGroup>
        {AMENITY_OPTIONS.map((option) => (
          <FormControlLabel
            key={option.value}
            control={
              <Checkbox
                checked={value.includes(option.value)}
                onChange={() => toggle(option.value)}
                size="small"
              />
            }
            label={option.label}
          />
        ))}
      </FormGroup>
    </Box>
  )
}

AmenityFilter.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
}

export default AmenityFilter
