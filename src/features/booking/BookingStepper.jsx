import { memo } from 'react'
import PropTypes from 'prop-types'
import { Stepper, Step, StepLabel, Box } from '@mui/material'
import { motion } from 'framer-motion'
import { BOOKING_STEPS } from '@/constants/bookingOptions'

/**
 * Animated stepper for the booking wizard.
 */
function BookingStepper({ activeStep }) {
  return (
    <Box
      component={motion.div}
      data-testid="booking-stepper"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      sx={{ mb: 4, overflowX: 'auto' }}
      aria-label="Booking progress"
    >
      <Stepper activeStep={activeStep} alternativeLabel>
        {BOOKING_STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  )
}

BookingStepper.propTypes = {
  activeStep: PropTypes.number.isRequired,
}

export default memo(BookingStepper)
