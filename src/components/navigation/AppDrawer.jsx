import PropTypes from 'prop-types'
import { Drawer, Box } from '@mui/material'

/**
 * Generic application drawer.
 */
function AppDrawer({ open, onClose, children, anchor = 'right', width = 320 }) {
  return (
    <Drawer anchor={anchor} open={open} onClose={onClose}>
      <Box sx={{ width }} role="presentation">
        {children}
      </Box>
    </Drawer>
  )
}

AppDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  children: PropTypes.node,
  anchor: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
  width: PropTypes.number,
}

export default AppDrawer
