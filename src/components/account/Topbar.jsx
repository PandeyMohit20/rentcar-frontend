import PropTypes from 'prop-types'
import { AppBar, Toolbar, IconButton, Box, Badge } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsIcon from '@mui/icons-material/Notifications'
import SettingsIcon from '@mui/icons-material/Settings'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import UserAvatar from './UserAvatar'

/**
 * Topbar for the account dashboard with quick actions and navigation.
 */
function Topbar({ onMenuClick, user = {}, unreadCount = 0 }) {
  const navigate = useNavigate()

  return (
    <AppBar position="static" color="inherit" elevation={1}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="Toggle sidebar"
          onClick={onMenuClick}
          sx={{ mr: 1, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton
          aria-label="Notifications"
          onClick={() => navigate(ROUTES.ACCOUNT_NOTIFICATIONS)}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton aria-label="Settings" onClick={() => navigate(ROUTES.ACCOUNT_SETTINGS)}>
          <SettingsIcon />
        </IconButton>
        <IconButton aria-label="Profile" onClick={() => navigate(ROUTES.MY_PROFILE)}>
          <UserAvatar
            firstName={user?.firstName}
            lastName={user?.lastName}
            src={user?.avatar}
            size={32}
          />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

Topbar.propTypes = {
  onMenuClick: PropTypes.func,
  user: PropTypes.object,
  unreadCount: PropTypes.number,
}

export default Topbar
