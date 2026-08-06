import { memo } from 'react'
import PropTypes from 'prop-types'
import { Box, Typography } from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel'
import { motion } from 'framer-motion'

/**
 * Payment / booking failure card.
 */
function FailureCard({ title, message }) {
  return (
    <Box
      component={motion.div}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      sx={{ textAlign: 'center', py: 4 }}
      aria-label="Failed"
    >
      <CancelIcon color="error" sx={{ fontSize: 72 }} />
      <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  )
}

FailureCard.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
}

export default memo(FailureCard)
