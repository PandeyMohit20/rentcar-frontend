import { memo } from 'react'
import PropTypes from 'prop-types'
import { Box, Stepper, Step, StepLabel, Typography } from '@mui/material'
import { formatDate } from '@/utils/date'

const timelineLabels = ['Booked', 'Pickup', 'Trip', 'Drop']

/**
 * Reservation trip timeline.
 */
function TripTimeline({ booking }) {
  const active = booking?.status === 'completed' ? 4 : booking ? 1 : 0

  return (
    <Box aria-label="Trip timeline">
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Trip Timeline
      </Typography>
      <Stepper activeStep={active} alternativeLabel>
        {timelineLabels.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {booking?.startDate && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          Pickup: {formatDate(booking.startDate)}
        </Typography>
      )}
    </Box>
  )
}

TripTimeline.propTypes = {
  booking: PropTypes.shape({
    status: PropTypes.string,
    startDate: PropTypes.string,
  }),
}

export default memo(TripTimeline)
