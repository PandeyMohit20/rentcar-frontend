import { memo } from 'react'
import PropTypes from 'prop-types'
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Typography,
} from '@mui/material'
import { INSURANCE_OPTIONS } from '@/constants/bookingOptions'

/**
 * Insurance selection options.
 */
function InsuranceOptions({ value, onChange }) {
  return (
    <Box aria-label="Insurance options">
      <FormControl component="fieldset" fullWidth>
        <FormLabel component="legend">Select Insurance</FormLabel>
        <RadioGroup value={value} onChange={(e) => onChange(e.target.value)}>
          {INSURANCE_OPTIONS.map((option) => (
            <Box key={option.value} sx={{ mb: 1 }}>
              <FormControlLabel value={option.value} control={<Radio />} label={option.label} />
              <Typography variant="caption" color="text.secondary" sx={{ pl: 3, display: 'block' }}>
                {option.description}
              </Typography>
            </Box>
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  )
}

InsuranceOptions.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}

export default memo(InsuranceOptions)
