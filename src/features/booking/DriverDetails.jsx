import { memo } from 'react'
import PropTypes from 'prop-types'
import { Box, Typography } from '@mui/material'

/**
 * Primary driver summary.
 */
function DriverDetails({ driver }) {
  if (!driver) return null

  return (
    <Box aria-label="Driver details">
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Primary Driver
      </Typography>
      <Typography variant="body2">
        {driver.firstName} {driver.lastName}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {driver.email}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {driver.phone}
      </Typography>
    </Box>
  )
}

DriverDetails.propTypes = {
  driver: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
  }),
}

export default memo(DriverDetails)
