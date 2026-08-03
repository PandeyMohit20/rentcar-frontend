import PropTypes from 'prop-types'
import { Box, CircularProgress } from '@mui/material'
import { motion } from 'framer-motion'

/**
 * Full-viewport loader used by the persist gate and lazy route fallbacks.
 */
function FullPageLoader({ label = 'Loading…' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <CircularProgress size={56} thickness={4} color="primary" />
        {label && (
          <Box component="span" color="text.secondary" fontSize="0.9rem">
            {label}
          </Box>
        )}
      </Box>
    </motion.div>
  )
}

FullPageLoader.propTypes = {
  label: PropTypes.string,
}

export default FullPageLoader
