import { memo } from 'react'
import PropTypes from 'prop-types'
import { Box, Typography } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { motion } from 'framer-motion'

/**
 * Payment / booking success card.
 */
function SuccessCard({ title, message, reference }) {
  return (
    <Box
      component={motion.div}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      sx={{ textAlign: 'center', py: 4 }}
      aria-label="Success"
    >
      <CheckCircleOutlineIcon color="success" sx={{ fontSize: 72 }} />
      <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {message}
      </Typography>
      {reference && (
        <Typography variant="body2" color="text.secondary">
          Reference: {reference}
        </Typography>
      )}
    </Box>
  )
}

SuccessCard.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  reference: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default memo(SuccessCard)
