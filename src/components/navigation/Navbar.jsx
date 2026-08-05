import { useState } from 'react'
import PropTypes from 'prop-types'
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Stack,
  Tooltip,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { useAppDispatch } from '@/hooks/useRedux'
import { logout } from '@/redux/slices/authSlice'
import { useTheme } from '@/contexts/ThemeContext'

/**
 * Main navigation bar with theme toggle, search, wishlist and notifications.
 */
function Navbar({ menus = [] }) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAuth()
  const { mode, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate(ROUTES.HOME)
  }

  const authLinks = isAuthenticated
    ? [
        { label: 'My Bookings', to: ROUTES.BOOKING_HISTORY },
        { label: 'Wishlist', to: ROUTES.WISHLIST },
        { label: 'Profile', to: ROUTES.PROFILE },
      ]
    : []

  const renderLink = (menu) => (
    <Button key={menu.to} color="inherit" component={Link} to={menu.to}>
      {menu.label}
    </Button>
  )

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" color="inherit">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={() => setMobileOpen(true)}
            sx={{ mr: 1, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Button
            component={Link}
            to={ROUTES.HOME}
            color="inherit"
            sx={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: -0.5 }}
          >
            RentCar
          </Button>

          <Box sx={{ flexGrow: 1 }} />

          <Stack direction="row" spacing={0.5} alignItems="center">
            <Tooltip title="Search">
              <IconButton color="inherit" component={Link} to={ROUTES.SEARCH} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Tooltip>

            {isAuthenticated && (
              <>
                <Tooltip title="Wishlist">
                  <IconButton
                    color="inherit"
                    component={Link}
                    to={ROUTES.WISHLIST}
                    aria-label="wishlist"
                  >
                    <FavoriteBorderIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Notifications">
                  <IconButton
                    color="inherit"
                    component={Link}
                    to={ROUTES.NOTIFICATIONS}
                    aria-label="notifications"
                  >
                    <NotificationsNoneIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}

            <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
              <IconButton color="inherit" onClick={toggleTheme} aria-label="toggle theme">
                {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Tooltip>
          </Stack>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, ml: 1 }}>
            {menus.map(renderLink)}
            {authLinks.map(renderLink)}
            {isAuthenticated ? (
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button color="primary" variant="contained" component={Link} to={ROUTES.LOGIN}>
                Sign In
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box
          sx={{ width: 280 }}
          role="presentation"
          onClick={() => setMobileOpen(false)}
          onKeyDown={() => setMobileOpen(false)}
        >
          <List>
            {[...menus, ...authLinks].map((menu) => (
              <ListItem key={menu.to} disablePadding>
                <ListItemButton component={Link} to={menu.to}>
                  <ListItemText primary={menu.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to={ROUTES.SEARCH}>
                <ListItemText primary="Search Cars" />
              </ListItemButton>
            </ListItem>
            {isAuthenticated && (
              <ListItem disablePadding>
                <ListItemButton component={Link} to={ROUTES.NOTIFICATIONS}>
                  <ListItemText primary="Notifications" />
                </ListItemButton>
              </ListItem>
            )}
            <ListItem disablePadding>
              <ListItemButton component={Link} to={ROUTES.HOME} onClick={handleLogout}>
                <ListItemText primary={isAuthenticated ? 'Logout' : 'Sign In'} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  )
}

Navbar.propTypes = {
  menus: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired,
    })
  ),
}

export default Navbar
