import { memo } from 'react'
import PropTypes from 'prop-types'
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Box } from '@mui/material'
import { PAYMENT_METHODS } from '@/constants/bookingOptions'

/**
 * Payment method radio selection.
 */
function PaymentMethod({ value, onChange }) {
  return (
    <Box aria-label="Payment method">
      <FormControl component="fieldset" fullWidth>
        <FormLabel component="legend">Select Payment Method</FormLabel>
        <RadioGroup value={value} onChange={(e) => onChange(e.target.value)}>
          {PAYMENT_METHODS.map((method) => (
            <FormControlLabel
              key={method.value}
              value={method.value}
              control={<Radio />}
              label={method.label}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  )
}

PaymentMethod.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}

export default memo(PaymentMethod)
