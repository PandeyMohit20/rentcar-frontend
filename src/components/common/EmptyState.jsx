import PropTypes from 'prop-types'
import { Box, Typography, Button } from '@mui/material'
import { motion } from 'framer-motion'

/**
 * Reusable empty state placeholder.
 */
function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 8,
          px: 2,
        }}
      >
        {Icon && (
          <Box sx={{ mb: 2, color: 'text.disabled' }}>
            <Icon sx={{ fontSize: 64 }} />
          </Box>
        )}
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
            {description}
          </Typography>
        )}
        {actionLabel && onAction && (
          <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </Box>
    </motion.div>
  )
}

EmptyState.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
}

export default EmptyState
