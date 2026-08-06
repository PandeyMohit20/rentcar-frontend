import { memo } from 'react'
import PropTypes from 'prop-types'
import { Typography } from '@mui/material'
import { formatDate } from '@/utils/date'

/**
 * Drop summary.
 */
function DropDetails({ dropDate, dropLocation }) {
  return (
    <div>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Drop
      </Typography>
      <Typography variant="body2">{dropLocation || '—'}</Typography>
      <Typography variant="body2" color="text.secondary">
        {dropDate ? formatDate(dropDate) : '—'}
      </Typography>
    </div>
  )
}

DropDetails.propTypes = {
  dropDate: PropTypes.string,
  dropLocation: PropTypes.string,
}

export default memo(DropDetails)
