import PropTypes from 'prop-types'
import { Typography as MuiTypography } from '@mui/material'

/**
 * Convenience wrapper around MUI Typography with default color.
 */
function Typography({ children, color = 'text.primary', ...props }) {
  return (
    <MuiTypography color={color} {...props}>
      {children}
    </MuiTypography>
  )
}

Typography.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.string,
}

export default Typography
