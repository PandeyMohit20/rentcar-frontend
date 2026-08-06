import { memo } from 'react'
import PropTypes from 'prop-types'
import { Box, CircularProgress, Typography } from '@mui/material'
import { motion } from 'framer-motion'

/**
 * Full-area loading overlay used during payment/booking processing.
 */
function LoadingOverlay({ open, message = 'Processing…' }) {
  if (!open) return null

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 1300,
        bgcolor: 'rgba(0,0,0,0.45)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <CircularProgress color="inherit" />
      <Typography variant="body1" color="common.white">
        {message}
      </Typography>
    </Box>
  )
}

LoadingOverlay.propTypes = {
  open: PropTypes.bool,
  message: PropTypes.string,
}

export default memo(LoadingOverlay)
