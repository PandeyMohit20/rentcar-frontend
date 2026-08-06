import PropTypes from 'prop-types'
import { Box, Typography, FormGroup, FormControlLabel, Checkbox } from '@mui/material'
import { CAR_BRANDS } from '@/constants/carFilters'

/**
 * Multi-select brand filter.
 */
function BrandFilter({ value = [], onChange }) {
  const toggle = (val) => {
    const next = value.includes(val) ? value.filter((v) => v !== val) : [...value, val]
    onChange && onChange(next)
  }

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Brand
      </Typography>
      <FormGroup>
        {CAR_BRANDS.map((brand) => (
          <FormControlLabel
            key={brand}
            control={
              <Checkbox
                checked={value.includes(brand)}
                onChange={() => toggle(brand)}
                size="small"
              />
            }
            label={brand}
          />
        ))}
      </FormGroup>
    </Box>
  )
}

BrandFilter.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
}

export default BrandFilter
