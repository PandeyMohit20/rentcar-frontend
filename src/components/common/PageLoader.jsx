import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import { Box, CircularProgress } from '@mui/material'

/**
 * Page-level loading indicator with a subtle fade animation.
 */
function PageLoader({ label = 'Loading…' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          gap: 2,
        }}
      >
        <CircularProgress size={40} color="primary" />
        {label && (
          <Box component="span" color="text.secondary" fontSize="0.875rem">
            {label}
          </Box>
        )}
      </Box>
    </motion.div>
  )
}

PageLoader.propTypes = {
  label: PropTypes.string,
}

export default PageLoader
