import { memo } from 'react'
import PropTypes from 'prop-types'
import { Checkbox, FormControlLabel, FormGroup, Box, Typography } from '@mui/material'
import { ADDON_OPTIONS } from '@/constants/bookingOptions'

/**
 * Add-ons selection.
 */
function AddOns({ selected, onChange }) {
  const toggle = (value) => {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value]
    onChange(next)
  }

  return (
    <Box aria-label="Add-ons selection">
      <FormGroup>
        {ADDON_OPTIONS.map((option) => (
          <Box key={option.value} sx={{ mb: 0.5 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selected.includes(option.value)}
                  onChange={() => toggle(option.value)}
                />
              }
              label={option.label}
            />
            <Typography variant="caption" color="text.secondary" sx={{ pl: 4, display: 'block' }}>
              {option.description}
            </Typography>
          </Box>
        ))}
      </FormGroup>
    </Box>
  )
}

AddOns.propTypes = {
  selected: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
}

export default memo(AddOns)
