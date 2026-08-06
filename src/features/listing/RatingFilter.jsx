import PropTypes from 'prop-types'
import { Box, Typography, FormControlLabel, RadioGroup, Radio } from '@mui/material'

const RATING_OPTIONS = [
  { value: 4.5, label: '4.5 & up' },
  { value: 4.0, label: '4.0 & up' },
  { value: 3.5, label: '3.5 & up' },
]

/**
 * Minimum star rating filter.
 */
function RatingFilter({ value = 0, onChange }) {
  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Rating
      </Typography>
      <RadioGroup value={value} onChange={(e) => onChange && onChange(Number(e.target.value))}>
        {RATING_OPTIONS.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio size="small" />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </Box>
  )
}

RatingFilter.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
}

export default RatingFilter
