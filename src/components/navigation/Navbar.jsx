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
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/contexts/ThemeContext'
import LogoutButton from '@/components/authentication/LogoutButton'

/**
 * Main navigation bar with theme toggle, search, wishlist and notifications.
 */
function Navbar({ menus = [] }) {
  const { isAuthenticated, isRestoring } = useAuth()
  const { mode, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  const authLinks = isAuthenticated
    ? [
        { label: 'My Bookings', to: ROUTES.MY_BOOKINGS },
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
            sx={{ mr: 1, display: { xs: 'inline-flex', md: 'none' } }}
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

            <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
              <IconButton color="inherit" onClick={toggleTheme} aria-label="toggle theme">
                {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Tooltip>
          </Stack>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, ml: 1 }}>
            {menus.map(renderLink)}
            {authLinks.map(renderLink)}
            {isRestoring ? null : isAuthenticated ? (
              <LogoutButton />
            ) : (
              <Button color="primary" variant="contained" component={Link} to={ROUTES.LOGIN}>
                Sign In
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 280 }} role="presentation" onClick={() => setMobileOpen(false)}>
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

            {!isRestoring && (
              <ListItem disablePadding>
                {isAuthenticated ? (
                  <LogoutButton fullWidth onComplete={() => setMobileOpen(false)} />
                ) : (
                  <ListItemButton component={Link} to={ROUTES.LOGIN}>
                    <ListItemText primary="Sign In" />
                  </ListItemButton>
                )}
              </ListItem>
            )}
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
