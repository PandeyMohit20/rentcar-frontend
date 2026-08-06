import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Box, Drawer } from '@mui/material'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useAppSelector } from '@/hooks/useRedux'
import { useAuth } from '@/hooks/useAuth'

/**
 * Account dashboard layout with persistent sidebar and topbar.
 */
function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user } = useAuth()
  const unreadCount = useAppSelector((state) => state.notification.unreadCount)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <Topbar onMenuClick={() => setMobileOpen(true)} user={user} unreadCount={unreadCount} />
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {/* Desktop sidebar */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Sidebar />
        </Box>
        {/* Mobile drawer */}
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
        >
          <Box sx={{ width: 260 }}>
            <Sidebar />
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, minWidth: 0 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default DashboardLayout
