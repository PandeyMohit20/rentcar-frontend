import { useMemo } from 'react'
import { useToast } from '@/contexts/ToastContext'
import { AccountPageShell, ReferralCard } from '@/components/account'
import { useReferralDetails } from '@/features/referral'
import MaterialCard from '@/components/ui/MaterialCard'
import { Box, Grid, Typography } from '@mui/material'

/**
 * Referral page — referral code, link and referred users.
 */
function ReferralPage() {
  const { showSuccess } = useToast()
  const { data } = useReferralDetails()

  const referral = useMemo(() => data ?? {}, [data])
  const referredUsers = useMemo(() => referral.referredUsers ?? [], [referral])

  const handleShare = () => {
    if (referral.referralLink) {
      navigator.clipboard?.writeText(referral.referralLink)
      showSuccess('Referral link copied.')
    }
  }

  return (
    <AccountPageShell title="Referral" description="Refer a friend and earn rewards.">
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <ReferralCard referral={referral} onShare={handleShare} />
        </Grid>
        <Grid item xs={12} md={8}>
          <MaterialCard sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Referred Users
            </Typography>
            {referredUsers.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No referrals yet. Share your code to get started.
              </Typography>
            ) : (
              <Box>
                {referredUsers.map((user) => (
                  <Typography key={user.id} variant="body2">
                    {user.name} — {user.status}
                  </Typography>
                ))}
              </Box>
            )}
          </MaterialCard>
        </Grid>
      </Grid>
    </AccountPageShell>
  )
}

export default ReferralPage
