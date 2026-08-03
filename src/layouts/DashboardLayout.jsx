import { useState } from 'react'
import PropTypes from 'prop-types'
import { Outlet } from 'react-router-dom'
import { Box, Toolbar, IconButton, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Navbar from '@/components/navigation/Navbar'
import Footer from '@/components/navigation/Footer'
import SideNav from '@/components/navigation/SideNav'

/**
 * Authenticated dashboard layout with navbar and side navigation.
 */
function DashboardLayout({ menus = [], sideNavItems = [] }) {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar menus={menus} />
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open side nav"
          onClick={() => setNavOpen(true)}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6">Dashboard</Typography>
      </Toolbar>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
      <Footer />
      <SideNav open={navOpen} onClose={() => setNavOpen(false)} items={sideNavItems} />
    </Box>
  )
}

DashboardLayout.propTypes = {
  menus: PropTypes.array,
  sideNavItems: PropTypes.array,
}

export default DashboardLayout
