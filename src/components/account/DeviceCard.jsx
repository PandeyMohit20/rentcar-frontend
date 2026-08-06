import PropTypes from 'prop-types'
import { Box, Typography, IconButton } from '@mui/material'
import DevicesIcon from '@mui/icons-material/Devices'
import DeleteIcon from '@mui/icons-material/Delete'
import MaterialCard from '@/components/ui/MaterialCard'

/**
 * Logged-in device card.
 */
function DeviceCard({ device = {}, onRevoke }) {
  return (
    <MaterialCard sx={{ p: 2, mb: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <DevicesIcon color="action" />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2">{device.name || 'Unknown device'}</Typography>
          <Typography variant="body2" color="text.secondary">
            {device.lastActive || '—'}
          </Typography>
        </Box>
        <IconButton
          aria-label="Revoke device access"
          color="error"
          onClick={() => onRevoke?.(device)}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </MaterialCard>
  )
}

DeviceCard.propTypes = {
  device: PropTypes.object,
  onRevoke: PropTypes.func,
}

export default DeviceCard
