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
import { Link, useLocation } from 'react-router-dom'
import Brand from '@/components/common/Brand'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
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
  const { pathname } = useLocation()

  const authLinks = isAuthenticated ? [{ label: 'Profile', to: ROUTES.PROFILE }] : []

  const renderLink = (menu) => (
    <Button
      key={menu.to}
      color="inherit"
      component={Link}
      to={menu.to}
      aria-current={pathname === menu.to ? 'page' : undefined}
      sx={{ color: pathname === menu.to ? 'primary.main' : 'text.secondary', fontSize: 13 }}
    >
      {menu.label}
    </Button>
  )

  return (
    <Box sx={{ position: 'sticky', top: 0, zIndex: 1100, flexShrink: 0 }}>
      <AppBar
        position="static"
        color="inherit"
        sx={{ borderRadius: 0, boxShadow: '0 3px 16px rgba(16,35,32,.04)' }}
      >
        <Toolbar sx={{ maxWidth: 1280, width: '100%', mx: 'auto', minHeight: { xs: 68, md: 80 } }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="Open navigation"
            aria-expanded={mobileOpen}
            aria-controls={mobileOpen ? 'mobile-navigation' : undefined}
            onClick={() => setMobileOpen(true)}
            sx={{ mr: 1, display: { xs: 'inline-flex', lg: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Button
            component={Link}
            to={ROUTES.HOME}
            color="inherit"
            sx={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: -0.5 }}
          >
            <Brand />
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

          <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 1, ml: 1 }}>
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
        <Box
          id="mobile-navigation"
          component="nav"
          aria-label="Mobile navigation"
          sx={{ width: 300, maxWidth: '90vw', p: 2 }}
          onClick={() => setMobileOpen(false)}
        >
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Brand />
            <IconButton aria-label="Close navigation" onClick={() => setMobileOpen(false)}>
              <CloseRoundedIcon />
            </IconButton>
          </Box>
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
