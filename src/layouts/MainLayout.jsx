import PropTypes from 'prop-types'
import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import Navbar from '@/components/navigation/Navbar'
import Footer from '@/components/navigation/Footer'
import { ROUTES } from '@/constants/routes'

/**
 * Main public layout with navbar, content outlet, and footer.
 */
function MainLayout({ menus = [] }) {
  const defaultMenus = [
    { label: 'Home', to: ROUTES.HOME },
    { label: 'Search', to: ROUTES.SEARCH },
    { label: 'Offers', to: ROUTES.OFFERS },
    { label: 'About', to: ROUTES.ABOUT },
    { label: 'Contact', to: ROUTES.CONTACT },
  ]

  const navMenus = menus.length ? menus : defaultMenus

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar menus={navMenus} />
      <Box component="main" sx={{ flexGrow: 1 }}>
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
