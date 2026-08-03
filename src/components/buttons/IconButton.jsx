import PropTypes from 'prop-types'
import { IconButton as MuiIconButton, Tooltip } from '@mui/material'

/**
 * Icon button with optional tooltip.
 */
function IconButton({ tooltip, children, ...props }) {
  const button = (
    <MuiIconButton color="default" {...props}>
      {children}
    </MuiIconButton>
  )

  if (tooltip) {
    return <Tooltip title={tooltip}>{button}</Tooltip>
  }

  return button
}

IconButton.propTypes = {
  tooltip: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export default IconButton
