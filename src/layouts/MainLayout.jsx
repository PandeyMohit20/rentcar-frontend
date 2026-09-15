import PropTypes from 'prop-types'
import { Outlet, useLocation } from 'react-router-dom'
import { Box } from '@mui/material'
import Navbar from '@/components/navigation/Navbar'
import Footer from '@/components/navigation/Footer'
import { ROUTES } from '@/constants/routes'

/**
 * Main public layout with navbar, content outlet, and footer.
 */
function MainLayout({ menus = [] }) {
  const { pathname } = useLocation()
  const defaultMenus = [
    { label: 'Home', to: ROUTES.HOME },
    { label: 'Cars', to: ROUTES.SEARCH },
    { label: 'How it works', to: '/#how-it-works' },
    { label: 'Locations', to: ROUTES.LOCATIONS },
    { label: 'My Bookings', to: ROUTES.MY_BOOKINGS },
  ]

  const navMenus = menus.length ? menus : defaultMenus

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        pb: {
          xs: pathname.startsWith('/cars/') ? 'calc(84px + env(safe-area-inset-bottom))' : 0,
          md: 0,
        },
      }}
    >
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar menus={navMenus} />
      <Box component="main" id="main-content" tabIndex={-1} sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  )
}

MainLayout.propTypes = {
  menus: PropTypes.array,
}

export default MainLayout
