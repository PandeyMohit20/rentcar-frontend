import { useMemo } from 'react'
import { Grid, Typography } from '@mui/material'
import { AccountPageShell, SettingsPanel } from '@/components/account'
import { useSettingsPreferences, useUpdateSetting } from '@/features/settings'
import { useToast } from '@/contexts/ToastContext'
import MaterialCard from '@/components/ui/MaterialCard'

/**
 * Settings page — theme, language and notification preferences.
 */
function SettingsPage() {
  const { showSuccess, showError } = useToast()
  const { data } = useSettingsPreferences()
  const updateSetting = useUpdateSetting()

  const preferences = useMemo(() => data ?? {}, [data])

  const handleChange = async (key, value) => {
    try {
      await updateSetting.mutateAsync({ [key]: value })
      showSuccess('Setting updated.')
    } catch (error) {
      showError(error?.message || 'Failed to update setting.')
    }
  }

  return (
    <AccountPageShell title="Settings" description="Manage your account preferences.">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <SettingsPanel preferences={preferences} onChange={handleChange} />
        </Grid>
        <Grid item xs={12} md={6}>
          <MaterialCard sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              General
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Theme: {preferences.theme ?? 'light'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Language: {preferences.language ?? 'en'}
            </Typography>
          </MaterialCard>
        </Grid>
      </Grid>
    </AccountPageShell>
  )
}

export default SettingsPage
