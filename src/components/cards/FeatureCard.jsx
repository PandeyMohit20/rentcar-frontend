import PropTypes from 'prop-types'
import { Box, Typography } from '@mui/material'
import MaterialCard from '@/components/ui/MaterialCard'

/**
 * Card highlighting a feature/benefit on landing pages.
 */
function FeatureCard({ icon: Icon, title, description }) {
  return (
    <MaterialCard>
      <Box sx={{ p: 3, textAlign: 'center' }}>
        {Icon && (
          <Box sx={{ mb: 2, color: 'primary.main' }}>
            <Icon sx={{ fontSize: 48 }} />
          </Box>
        )}
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </MaterialCard>
  )
}

FeatureCard.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
}

export default FeatureCard
