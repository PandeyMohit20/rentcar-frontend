import { useMemo } from 'react'
import { AccountPageShell, RewardCard } from '@/components/account'
import { useRewardBalance, useRewardHistory } from '@/features/rewards'
import MaterialCard from '@/components/ui/MaterialCard'
import { Grid, Typography, Box } from '@mui/material'
import EmptyState from '@/components/common/EmptyState'

/**
 * Rewards page — points balance and history.
 */
function RewardsPage() {
  const { data: balanceData } = useRewardBalance()
  const { data: historyData, isLoading } = useRewardHistory()

  const balance = useMemo(() => balanceData ?? { points: 0 }, [balanceData])
  const rewards = useMemo(() => historyData?.rewards ?? [], [historyData])

  return (
    <AccountPageShell title="Rewards" description="Your reward points and history.">
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <RewardCard points={balance.points ?? 0} />
        </Grid>
        <Grid item xs={12} md={8}>
          <MaterialCard sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Reward History
            </Typography>
            {isLoading && <Typography variant="body2">Loading…</Typography>}
            {!isLoading && rewards.length === 0 && (
              <EmptyState title="No rewards yet" description="Earn points by booking cars." />
            )}
            <Box>
              {rewards.map((reward) => (
                <Typography key={reward.id} variant="body2">
                  {reward.description || reward.type} — {reward.points} pts
                </Typography>
              ))}
            </Box>
          </MaterialCard>
        </Grid>
      </Grid>
    </AccountPageShell>
  )
}

export default RewardsPage
