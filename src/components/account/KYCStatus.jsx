import PropTypes from 'prop-types'
import { Box, Typography, LinearProgress, Chip } from '@mui/material'
import MaterialCard from '@/components/ui/MaterialCard'

const statusColor = (status) => {
  switch (status) {
    case 'verified':
      return 'success'
    case 'pending':
      return 'warning'
    case 'rejected':
      return 'error'
    default:
      return 'default'
  }
}

/**
 * KYC verification status card.
 */
function KYCStatus({ kyc = {} }) {
  const items = [
    { label: 'PAN', status: kyc?.pan?.status },
    { label: 'Aadhaar', status: kyc?.aadhaar?.status },
    { label: 'Passport', status: kyc?.passport?.status },
    { label: 'Driving License', status: kyc?.drivingLicense?.status },
  ]

  const verifiedCount = items.filter((i) => i.status === 'verified').length
  const progress = Math.round((verifiedCount / items.length) * 100)

  return (
    <MaterialCard sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        KYC Status
      </Typography>
      <Box sx={{ mb: 2 }}>
        <LinearProgress variant="determinate" value={progress} sx={{ mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          {progress}% verified
        </Typography>
      </Box>
      {items.map((item) => (
        <Box
          key={item.label}
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}
        >
          <Typography variant="body2">{item.label}</Typography>
          <Chip
            label={item.status ?? 'not_submitted'}
            color={statusColor(item.status)}
            size="small"
          />
        </Box>
      ))}
    </MaterialCard>
  )
}

KYCStatus.propTypes = {
  kyc: PropTypes.object,
}

export default KYCStatus
