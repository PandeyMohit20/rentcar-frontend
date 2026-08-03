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
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { useAppDispatch } from '@/hooks/useRedux'
import { logout } from '@/redux/slices/authSlice'

/**
 * Main navigation bar.
 */
function Navbar({ menus = [] }) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAuth()
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
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Button
            component={Link}
            to={ROUTES.HOME}
            color="inherit"
            sx={{ fontWeight: 700, fontSize: '1.1rem' }}
          >
            RentCar
          </Button>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
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
          sx={{ width: 260 }}
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
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to={isAuthenticated ? ROUTES.HOME : ROUTES.LOGIN}
                onClick={isAuthenticated ? handleLogout : undefined}
              >
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
