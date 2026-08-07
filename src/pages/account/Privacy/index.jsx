import { useMemo } from 'react'
import { Grid, Typography } from '@mui/material'
import { AccountPageShell, PrivacyPanel } from '@/components/account'
import { useSettingsPreferences, useUpdateSetting } from '@/features/settings'
import { useToast } from '@/contexts/ToastContext'
import MaterialCard from '@/components/ui/MaterialCard'

/**
 * Privacy page — privacy controls.
 */
function PrivacyPage() {
  const { showSuccess, showError } = useToast()
  const { data } = useSettingsPreferences()
  const updateSetting = useUpdateSetting()

  const privacy = useMemo(
    () => ({
      profileVisibility: data?.profileVisibility ?? true,
      shareTripHistory: data?.shareTripHistory ?? false,
      dataCollection: data?.dataCollection ?? true,
    }),
    [data]
  )

  const handleChange = async (key, value) => {
    try {
      await updateSetting.mutateAsync({ [key]: value })
      showSuccess('Privacy setting updated.')
    } catch (error) {
      showError(error?.message || 'Failed to update privacy setting.')
    }
  }

  return (
    <AccountPageShell title="Privacy" description="Control how your data is used and shared.">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <PrivacyPanel privacy={privacy} onChange={handleChange} />
        </Grid>
        <Grid item xs={12} md={6}>
          <MaterialCard sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Data & Privacy
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Visit our{' '}
              <a href="/privacy-policy" target="_blank" rel="noreferrer">
                Privacy Policy
              </a>{' '}
              for full details on how we handle your data.
            </Typography>
          </MaterialCard>
        </Grid>
      </Grid>
    </AccountPageShell>
  )
}

export default PrivacyPage
