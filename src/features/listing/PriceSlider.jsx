import PropTypes from 'prop-types'
import { Box, Typography, Slider } from '@mui/material'
import { formatCurrency } from '@/utils/formatters'
import { DEFAULT_PRICE_RANGE } from '@/constants/carFilters'

/**
 * Price range slider for filtering search results.
 */
function PriceSlider({ value = DEFAULT_PRICE_RANGE, min = 0, max = 25000, onChange }) {
  const handleChange = (_, newValue) => onChange && onChange(newValue)

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Price Range
      </Typography>
      <Slider
        value={value}
        min={min}
        max={max}
        step={100}
        valueLabelDisplay="auto"
        valueLabelFormat={(v) => formatCurrency(v)}
        onChange={handleChange}
        getAriaLabel={() => 'Price range'}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary">
          {formatCurrency(value[0])}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatCurrency(value[1])}
        </Typography>
      </Box>
    </Box>
  )
}

PriceSlider.propTypes = {
  value: PropTypes.arrayOf(PropTypes.number),
  min: PropTypes.number,
  max: PropTypes.number,
  onChange: PropTypes.func,
}

export default PriceSlider
