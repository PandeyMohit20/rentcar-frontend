import PropTypes from 'prop-types'
import { Box, Typography, FormGroup, FormControlLabel, Checkbox } from '@mui/material'
import { TRANSMISSION_OPTIONS } from '@/constants/carFilters'

/**
 * Multi-select transmission filter.
 */
function TransmissionFilter({ value = [], onChange }) {
  const toggle = (val) => {
    const next = value.includes(val) ? value.filter((v) => v !== val) : [...value, val]
    onChange && onChange(next)
  }

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Transmission
      </Typography>
      <FormGroup>
        {TRANSMISSION_OPTIONS.map((option) => (
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

TransmissionFilter.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
}

export default TransmissionFilter
