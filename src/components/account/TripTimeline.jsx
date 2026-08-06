import PropTypes from 'prop-types'
import { Step, StepLabel, Stepper, Typography } from '@mui/material'
import MaterialCard from '@/components/ui/MaterialCard'

/**
 * Vertical trip timeline from events.
 */
function TripTimeline({ events = [] }) {
  if (events.length === 0) {
    return (
      <MaterialCard sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary">
          No timeline events available.
        </Typography>
      </MaterialCard>
    )
  }

  return (
    <Stepper orientation="vertical" nonLinear activeStep={events.length - 1}>
      {events.map((event, index) => (
        <Step key={event.id ?? index} completed>
          <StepLabel>
            <Typography variant="subtitle2">{event.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {event.timestamp}
            </Typography>
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  )
}

TripTimeline.propTypes = {
  events: PropTypes.array,
}

export default TripTimeline
