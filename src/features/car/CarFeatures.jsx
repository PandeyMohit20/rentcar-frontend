import PropTypes from 'prop-types'
import { Box, Typography, Chip } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

/**
 * Car amenities/features chips.
 */
function CarFeatures({ features = [] }) {
  if (features.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No features listed.
      </Typography>
    )
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Features
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {features.map((feature) => (
          <Chip
            key={feature}
            icon={<CheckCircleIcon color="success" />}
            label={feature}
            variant="outlined"
            size="small"
          />
        ))}
      </Box>
    </Box>
  )
}

CarFeatures.propTypes = {
  features: PropTypes.arrayOf(PropTypes.string),
}

export default CarFeatures
