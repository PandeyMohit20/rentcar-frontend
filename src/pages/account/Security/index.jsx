import { useMemo, useState } from 'react'
import { Grid, Box, Typography, Dialog, DialogTitle, DialogContent } from '@mui/material'
import { AccountPageShell, SecurityCard, DeviceCard } from '@/components/account'
import {
  useTwoFactorStatus,
  useEnableTwoFactor,
  useDisableTwoFactor,
  useActiveSessions,
  useTrustedDevices,
  useRevokeDevice,
  useChangePassword,
} from '@/features/security'
import { useToast } from '@/contexts/ToastContext'
import MaterialCard from '@/components/ui/MaterialCard'
import InputField from '@/components/forms/InputField'
import LoadingButton from '@/components/buttons/LoadingButton'
import { useForm, FormProvider } from 'react-hook-form'

/**
 * Security page — password, 2FA, sessions and trusted devices.
 */
function SecurityPage() {
  const { showSuccess, showError } = useToast()
  const { data: twoFactorData } = useTwoFactorStatus()
  const { data: sessionsData } = useActiveSessions()
  const { data: devicesData } = useTrustedDevices()
  const enable2fa = useEnableTwoFactor()
  const disable2fa = useDisableTwoFactor()
  const revokeDevice = useRevokeDevice()
  const changePassword = useChangePassword()

  const [open, setOpen] = useState(false)

  const security = useMemo(
    () => ({
      twoFactorEnabled: Boolean(twoFactorData?.enabled),
      lastPasswordChange: twoFactorData?.lastPasswordChange,
    }),
    [twoFactorData]
  )
  const sessions = useMemo(() => sessionsData?.sessions ?? [], [sessionsData])
  const devices = useMemo(() => devicesData?.devices ?? [], [devicesData])

  const methods = useForm({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  const handleToggle2fa = async () => {
    try {
      if (security.twoFactorEnabled) {
        await disable2fa.mutateAsync({})
        showSuccess('Two factor authentication disabled.')
      } else {
        await enable2fa.mutateAsync({ method: 'otp' })
        showSuccess('Two factor authentication enabled (placeholder).')
      }
    } catch (error) {
      showError(error?.message || 'Failed to update 2FA.')
    }
  }

  const handleChangePassword = async (values) => {
    try {
      await changePassword.mutateAsync(values)
      showSuccess('Password changed (placeholder).')
      setOpen(false)
      methods.reset()
    } catch (error) {
      showError(error?.message || 'Failed to change password.')
    }
  }

  const handleRevoke = async (device) => {
    try {
      await revokeDevice.mutateAsync(device.id)
      showSuccess('Device access revoked.')
    } catch (error) {
      showError(error?.message || 'Failed to revoke device.')
    }
  }

  return (
    <AccountPageShell title="Security" description="Manage password, 2FA and sessions.">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <SecurityCard
            security={security}
            onChangePassword={() => setOpen(true)}
            onToggle2fa={handleToggle2fa}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <MaterialCard sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Active Sessions ({sessions.length})
            </Typography>
            {sessions.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No active sessions.
              </Typography>
            )}
            {sessions.map((session) => (
              <Typography key={session.id} variant="body2">
                {session.device} — {session.lastActive}
              </Typography>
            ))}
          </MaterialCard>
        </Grid>
        <Grid item xs={12}>
          <MaterialCard sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Trusted Devices
            </Typography>
            {devices.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No trusted devices.
              </Typography>
            )}
            <Box>
              {devices.map((device) => (
                <DeviceCard key={device.id} device={device} onRevoke={handleRevoke} />
              ))}
            </Box>
          </MaterialCard>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <FormProvider {...methods}>
            <Box
              component="form"
              onSubmit={methods.handleSubmit(handleChangePassword)}
              sx={{ display: 'grid', gap: 2, mt: 1 }}
            >
              <InputField name="currentPassword" label="Current Password" type="password" />
              <InputField name="newPassword" label="New Password" type="password" />
              <InputField name="confirmPassword" label="Confirm Password" type="password" />
              <LoadingButton type="submit" loading={changePassword.isPending}>
                Update Password
              </LoadingButton>
            </Box>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </AccountPageShell>
  )
}

export default SecurityPage
