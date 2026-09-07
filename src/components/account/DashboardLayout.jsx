import { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Avatar, Box, Button, Drawer, IconButton, Stack, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useAccountIdentity } from '@/features/profile'
import { useKycStatus } from '@/features/kyc'
import KycBadge from '@/features/kyc/KycBadge'
import { AccountSkeleton, AccountError } from './AccountUI'
import { ROUTES } from '@/constants/routes'
import { accountSurfaceStyles } from '@/features/account/accountStyles'

function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const identity = useAccountIdentity()
  const kyc = useKycStatus()
  return (
    <Box sx={accountSurfaceStyles}>
      <Topbar onMenuClick={() => setMobileOpen(true)} menuOpen={mobileOpen} />
      <Box sx={{ maxWidth: 1600, mx: 'auto', display: 'flex' }}>
        <Box sx={{ display: { xs: 'none', md: 'block' }, borderRight: 1, borderColor: 'divider' }}>
          <Sidebar />
        </Box>
        <Drawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{ display: { md: 'none' } }}
        >
          <Box id="account-mobile-navigation" sx={{ width: 260, maxWidth: '85vw' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
              <IconButton
                aria-label="Close account navigation"
                onClick={() => setMobileOpen(false)}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </Box>
        </Drawer>
        <Box
          component="main"
          id="account-main"
          sx={{ flex: 1, minWidth: 0, p: { xs: 2, sm: 3, lg: 4 } }}
        >
          <Box
            sx={{
              maxWidth: 1200,
              mx: 'auto',
              pb: 3,
              mb: 2,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            {identity.isPending ? (
              <AccountSkeleton rows={1} />
            ) : identity.error ? (
              <AccountError
                error={identity.error}
                onRetry={() => identity.refetch()}
                fallback="Your account summary could not be loaded."
              />
            ) : (
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                gap={2}
                justifyContent="space-between"
                alignItems={{ sm: 'center' }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 44, height: 44 }}>
                    {identity.data?.name?.slice(0, 1).toUpperCase()}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography fontWeight={700} sx={{ overflowWrap: 'anywhere' }}>
                      {identity.data?.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ overflowWrap: 'anywhere' }}
                    >
                      {identity.data?.email}
                    </Typography>
                  </Box>
                </Stack>
                <Button
                  component={Link}
                  to={ROUTES.KYC}
                  color="inherit"
                  sx={{ alignSelf: { xs: 'flex-start', sm: 'center' }, p: 0.5 }}
                >
                  <KycBadge
                    status={kyc.error ? undefined : kyc.data?.verificationStatus}
                    loading={kyc.isPending}
                  />
                </Button>
              </Stack>
            )}
          </Box>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
export default DashboardLayout
