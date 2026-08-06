import { memo } from 'react'
import PropTypes from 'prop-types'
import { Box } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import BookingStepper from './BookingStepper'

/**
 * Wraps the booking wizard steps with animated transitions.
 */
function BookingWizard({ activeStep, children }) {
  return (
    <Box>
      <BookingStepper activeStep={activeStep} />
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </Box>
  )
}

BookingWizard.propTypes = {
  activeStep: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
}

export default memo(BookingWizard)
