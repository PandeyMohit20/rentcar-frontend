import PropTypes from 'prop-types'
import { Box, Typography, Chip, Button } from '@mui/material'
import MaterialCard from '@/components/ui/MaterialCard'

/**
 * Security settings summary card (2FA, password).
 */
function SecurityCard({ security = {}, onChangePassword, onToggle2fa }) {
  return (
    <MaterialCard sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">Security</Typography>
        <Chip
          label={security.twoFactorEnabled ? '2FA On' : '2FA Off'}
          color={security.twoFactorEnabled ? 'success' : 'default'}
          size="small"
        />
      </Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Last password change: {security.lastPasswordChange || '—'}
      </Typography>
      <Box sx={{ mt: 1 }}>
        <Button size="small" onClick={onChangePassword}>
          Change Password
        </Button>
        <Button size="small" color="secondary" onClick={onToggle2fa}>
          {security.twoFactorEnabled ? 'Disable' : 'Enable'} 2FA
        </Button>
      </Box>
    </MaterialCard>
  )
}

SecurityCard.propTypes = {
  security: PropTypes.object,
  onChangePassword: PropTypes.func,
  onToggle2fa: PropTypes.func,
}

export default SecurityCard
