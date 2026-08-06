import { memo } from 'react'
import { Box, Typography } from '@mui/material'

/**
 * Cancellation policy summary.
 */
function CancellationPolicy() {
  return (
    <Box aria-label="Cancellation policy">
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Cancellation Policy
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Free cancellation up to 48 hours before pickup. A nominal fee applies for later
        cancellations. Refer to the full policy for details.
      </Typography>
    </Box>
  )
}

export default memo(CancellationPolicy)
