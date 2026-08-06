import PropTypes from 'prop-types'
import { Box, Typography, FormGroup, FormControlLabel, Checkbox } from '@mui/material'
import { CAR_CATEGORIES } from '@/constants/carFilters'

/**
 * Multi-select body category filter.
 */
function CategoryFilter({ value = [], onChange }) {
  const toggle = (val) => {
    const next = value.includes(val) ? value.filter((v) => v !== val) : [...value, val]
    onChange && onChange(next)
  }

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Category
      </Typography>
      <FormGroup>
        {CAR_CATEGORIES.map((option) => (
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

CategoryFilter.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
}

export default CategoryFilter
