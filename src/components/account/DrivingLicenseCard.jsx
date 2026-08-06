import PropTypes from 'prop-types'
import { Box, Typography, Chip, Button } from '@mui/material'
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
 * Driving license status and info card.
 */
function DrivingLicenseCard({ license = {}, onUpload }) {
  const status = license?.status ?? 'not_submitted'

  return (
    <MaterialCard sx={{ p: 3 }} hoverable>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">Driving License</Typography>
        <Chip label={status} color={statusColor(status)} size="small" />
      </Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        License No: {license?.number ?? '—'}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Valid Until: {license?.expiryDate ?? '—'}
      </Typography>
      {status !== 'verified' && (
        <Button variant="contained" size="small" onClick={onUpload} sx={{ mt: 1 }}>
          {status === 'not_submitted' ? 'Upload License' : 'Resubmit'}
        </Button>
      )}
    </MaterialCard>
  )
}

DrivingLicenseCard.propTypes = {
  license: PropTypes.object,
  onUpload: PropTypes.func,
}

export default DrivingLicenseCard
