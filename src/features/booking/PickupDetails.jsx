import { memo } from 'react'
import PropTypes from 'prop-types'
import { Typography } from '@mui/material'
import { formatDate } from '@/utils/date'

/**
 * Pickup summary.
 */
function PickupDetails({ pickupDate, pickupLocation }) {
  return (
    <div>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Pickup
      </Typography>
      <Typography variant="body2">{pickupLocation || '—'}</Typography>
      <Typography variant="body2" color="text.secondary">
        {pickupDate ? formatDate(pickupDate) : '—'}
      </Typography>
    </div>
  )
}

PickupDetails.propTypes = {
  pickupDate: PropTypes.string,
  pickupLocation: PropTypes.string,
}

export default memo(PickupDetails)
