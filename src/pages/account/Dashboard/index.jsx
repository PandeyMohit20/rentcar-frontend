import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Grid, Typography, Button } from '@mui/material'
import LuggageIcon from '@mui/icons-material/Luggage'
import WalletIcon from '@mui/icons-material/AccountBalanceWallet'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import NotificationsIcon from '@mui/icons-material/Notifications'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import VerifiedIcon from '@mui/icons-material/Verified'
import { DashboardWidget, BookingTable, ProfileCard, AccountPageShell } from '@/components/account'
import { useDashboardOverview } from '@/features/dashboard'
import { useToast } from '@/contexts/ToastContext'
import { ROUTES } from '@/constants/routes'
import { formatCurrency } from '@/utils/formatters'
import { useAuth } from '@/hooks/useAuth'

/**
 * Customer dashboard landing page.
 * Aggregates key widgets: upcoming trips, wallet, rewards, notifications,
 * support status, profile completion, KYC status and quick actions.
 */
function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showWarning } = useToast()
  const { data, isLoading } = useDashboardOverview()

  const overview = useMemo(() => data ?? {}, [data])

  const quickActions = [
    { label: 'Book a Car', to: ROUTES.SEARCH },
    { label: 'Add Money', to: ROUTES.WALLET },
    { label: 'Contact Support', to: ROUTES.ACCOUNT_SUPPORT },
    { label: 'Refer a Friend', to: ROUTES.REFERRAL },
  ]

  const handleRecharge = () => {
    showWarning('Wallet recharge is a placeholder. Connect backend to enable.')
    navigate(ROUTES.WALLET)
  }

  return (
    <AccountPageShell
      title="Dashboard"
      description="Welcome back. Here's an overview of your account."
    >
      <Grid container spacing={3}>
        {/* Profile summary */}
        <Grid item xs={12}>
          <ProfileCard
            user={{ ...user, profileCompletion: overview.profileCompletion ?? 0 }}
            onView={() => navigate(ROUTES.MY_PROFILE)}
          />
        </Grid>

        {/* Stat widgets */}
        <Grid item xs={12} sm={6} md={4}>
          <DashboardWidget
            icon={LuggageIcon}
            label="Upcoming Trips"
            value={overview.upcomingTrips?.length ?? 0}
            onClick={() => navigate(ROUTES.TRIP_HISTORY)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardWidget
            icon={WalletIcon}
            label="Wallet Balance"
            value={formatCurrency(overview.walletBalance ?? 0)}
            color="success"
            onClick={handleRecharge}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardWidget
            icon={CardGiftcardIcon}
            label="Reward Points"
            value={overview.rewardPoints ?? 0}
            color="warning"
            onClick={() => navigate(ROUTES.REWARDS)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardWidget
            icon={NotificationsIcon}
            label="Notifications"
            value={overview.notifications?.length ?? 0}
            color="info"
            onClick={() => navigate(ROUTES.ACCOUNT_NOTIFICATIONS)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardWidget
            icon={SupportAgentIcon}
            label="Support Status"
            value={overview.supportTickets?.length ?? 0}
            color="secondary"
            onClick={() => navigate(ROUTES.ACCOUNT_SUPPORT)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardWidget
            icon={VerifiedIcon}
            label="KYC Status"
            value={overview.kycStatus ?? 'unverified'}
            color="primary"
            onClick={() => navigate(ROUTES.KYC)}
          />
        </Grid>

        {/* Recent bookings */}
        <Grid item xs={12} md={8}>
          <BookingTable
            bookings={overview.recentBookings ?? []}
            loading={isLoading}
            onRowClick={(row) => navigate(ROUTES.BOOKING_DETAILS_WITH_ID(row.id))}
          />
        </Grid>

        {/* Quick actions */}
        <Grid item xs={12} md={4}>
          <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            {quickActions.map((action) => (
              <Button
                key={action.label}
                fullWidth
                variant="outlined"
                sx={{ mb: 1 }}
                onClick={() => navigate(action.to)}
              >
                {action.label}
              </Button>
            ))}
          </Box>
        </Grid>
      </Grid>
    </AccountPageShell>
  )
}

export default DashboardPage
