import { useMemo } from 'react'
import { Box, Typography } from '@mui/material'
import DevicesIcon from '@mui/icons-material/Devices'
import { AccountPageShell, DeviceCard } from '@/components/account'
import { useTrustedDevices, useRevokeDevice } from '@/features/security'
import { useToast } from '@/contexts/ToastContext'
import EmptyState from '@/components/common/EmptyState'
import MaterialCard from '@/components/ui/MaterialCard'

/**
 * My Devices page — browser/sessions and trusted devices.
 */
function DevicesPage() {
  const { showSuccess, showError } = useToast()
  const { data } = useTrustedDevices()
  const revokeDevice = useRevokeDevice()

  const devices = useMemo(() => data?.devices ?? [], [data])

  const handleRevoke = async (device) => {
    try {
      await revokeDevice.mutateAsync(device.id)
      showSuccess('Device access revoked.')
    } catch (error) {
      showError(error?.message || 'Failed to revoke device.')
    }
  }

  return (
    <AccountPageShell title="My Devices" description="Manage the devices signed into your account.">
      <MaterialCard sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Trusted Devices
        </Typography>
        {devices.length === 0 ? (
          <EmptyState
            icon={DevicesIcon}
            title="No trusted devices"
            description="Devices you authorize will appear here."
          />
        ) : (
          <Box>
            {devices.map((device) => (
              <DeviceCard key={device.id} device={device} onRevoke={handleRevoke} />
            ))}
          </Box>
        )}
      </MaterialCard>
    </AccountPageShell>
  )
}

export default DevicesPage
