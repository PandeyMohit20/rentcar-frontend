import PropTypes from 'prop-types'
import { Box } from '@mui/material'

/**
 * Flexible spacing element.
 */
function Spacer({ x = 0, y = 0, flexGrow = false }) {
  return (
    <Box
      sx={{
        width: typeof x === 'number' ? `${x * 8}px` : x,
        height: typeof y === 'number' ? `${y * 8}px` : y,
        flexGrow: flexGrow ? 1 : 0,
      }}
    />
  )
}

Spacer.propTypes = {
  x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  y: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  flexGrow: PropTypes.bool,
}

export default Spacer
