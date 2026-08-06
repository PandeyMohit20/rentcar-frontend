import PropTypes from 'prop-types'
import { Box, Typography, FormControlLabel, Switch } from '@mui/material'
import MaterialCard from '@/components/ui/MaterialCard'

/**
 * Privacy controls panel.
 */
function PrivacyPanel({ privacy = {}, onChange }) {
  const toggles = [
    { key: 'profileVisibility', label: 'Public Profile' },
    { key: 'shareTripHistory', label: 'Share Trip History' },
    { key: 'dataCollection', label: 'Allow Analytics' },
  ]

  return (
    <MaterialCard sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Privacy
      </Typography>
      {toggles.map((t) => (
        <FormControlLabel
          key={t.key}
          control={
            <Switch
              checked={Boolean(privacy[t.key])}
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

PrivacyPanel.propTypes = {
  privacy: PropTypes.object,
  onChange: PropTypes.func,
}

export default PrivacyPanel
