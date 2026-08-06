import PropTypes from 'prop-types'
import { useLocation, useNavigate } from 'react-router-dom'
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import { ACCOUNT_NAV } from './navigation'

/**
 * Persistent account sidebar with grouped navigation.
 * Uses router Link for navigation and highlights active section.
 */
function Sidebar({ width = 260 }) {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (to) => location.pathname.startsWith(to)

  return (
    <Box
      component="nav"
      aria-label="Account navigation"
      sx={{
        width,
        flexShrink: 0,
        borderRight: 1,
        borderColor: 'divider',
        height: '100%',
        overflowY: 'auto',
        display: { xs: 'none', md: 'block' },
      }}
    >
      <Box sx={{ px: 2, pt: 2 }}>
        <Typography variant="overline" color="text.secondary">
          My Account
        </Typography>
      </Box>
      {ACCOUNT_NAV.map((group) => (
        <Box key={group.section} sx={{ mt: 1 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ px: 2, display: 'block', mb: 0.5 }}
          >
            {group.section}
          </Typography>
          <List dense disablePadding>
            {group.items.map((item) => (
              <ListItemButton
                key={item.to}
                selected={isActive(item.to)}
                onClick={() => navigate(item.to)}
                sx={{ pl: 2 }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      ))}
    </Box>
  )
}

Sidebar.propTypes = {
  width: PropTypes.number,
}

export default Sidebar
