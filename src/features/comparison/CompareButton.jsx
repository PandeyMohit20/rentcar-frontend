import PropTypes from 'prop-types'
import { Button } from '@mui/material'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import { useComparison } from './useComparison'

/**
 * Toggle button for adding/removing a car to the comparison set.
 */
function CompareButton({ carId, label, size = 'small', fullWidth = false, sx }) {
  const { isCompared, toggle } = useComparison()

  const handleClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    toggle(carId, label)
  }

  return (
    <Button
      size={size}
      fullWidth={fullWidth}
      variant={isCompared(carId) ? 'contained' : 'outlined'}
      color={isCompared(carId) ? 'primary' : 'inherit'}
      startIcon={<CompareArrowsIcon />}
      onClick={handleClick}
      aria-pressed={isCompared(carId)}
      sx={sx}
    >
      {isCompared(carId) ? 'Comparing' : 'Compare'}
    </Button>
  )
}

CompareButton.propTypes = {
  carId: PropTypes.string.isRequired,
  label: PropTypes.string,
  size: PropTypes.string,
  fullWidth: PropTypes.bool,
  sx: PropTypes.object,
}

export default CompareButton
