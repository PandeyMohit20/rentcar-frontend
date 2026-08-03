import PropTypes from 'prop-types'
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  Box,
} from '@mui/material'

/**
 * Side navigation drawer for authenticated areas.
 */
function SideNav({ open, onClose, items = [], width = 260 }) {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width, py: 2 }} role="presentation" onClick={onClose}>
        <List>
          {items.map((item) => (
            <ListItem key={item.to} disablePadding>
              <ListItemButton
                component={item.component || 'a'}
                href={item.to}
                selected={item.active}
              >
                {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}

SideNav.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      to: PropTypes.string,
      icon: PropTypes.node,
      active: PropTypes.bool,
      component: PropTypes.elementType,
    })
  ),
  width: PropTypes.number,
}

export default SideNav
