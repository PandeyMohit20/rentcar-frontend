import PropTypes from 'prop-types'
import { Box, Typography, FormControlLabel, Switch } from '@mui/material'
import MaterialCard from '@/components/ui/MaterialCard'

/**
 * Notification / preference toggles panel.
 */
function SettingsPanel({ preferences = {}, onChange }) {
  const toggles = [
    { key: 'emailNotifications', label: 'Email Notifications' },
    { key: 'smsNotifications', label: 'SMS Notifications' },
    { key: 'pushNotifications', label: 'Push Notifications' },
    { key: 'marketingEmails', label: 'Marketing Emails' },
  ]

  return (
    <MaterialCard sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Preferences
      </Typography>
      {toggles.map((t) => (
        <FormControlLabel
          key={t.key}
          control={
            <Switch
              checked={Boolean(preferences[t.key])}
              onChange={(e) => onChange?.(t.key, e.target.checked)}
            />
          }
          label={t.label}
          sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
        />
      ))}
    </MaterialCard>
  )
}

SettingsPanel.propTypes = {
  preferences: PropTypes.object,
  onChange: PropTypes.func,
}

export default SettingsPanel
