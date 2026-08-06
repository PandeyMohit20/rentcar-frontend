import { memo } from 'react'
import PropTypes from 'prop-types'
import { Box, Typography } from '@mui/material'

/**
 * Additional driver summary.
 */
function AdditionalDriver({ driver }) {
  if (!driver || !driver.includeAdditionalDriver) return null

  return (
    <Box aria-label="Additional driver details">
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Additional Driver
      </Typography>
      <Typography variant="body2">
        {driver.firstName} {driver.lastName}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        License: {driver.licenseNumber}
      </Typography>
    </Box>
  )
}

AdditionalDriver.propTypes = {
  driver: PropTypes.shape({
    includeAdditionalDriver: PropTypes.bool,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    licenseNumber: PropTypes.string,
  }),
}

export default memo(AdditionalDriver)
