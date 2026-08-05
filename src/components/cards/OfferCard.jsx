import PropTypes from 'prop-types'
import { Box, Typography, Chip } from '@mui/material'
import MaterialCard from '@/components/ui/MaterialCard'
import HoverScale from '@/components/animations/HoverScale'

/**
 * Card displaying a promotional offer.
 */
function OfferCard({ offer }) {
  return (
    <HoverScale>
      <MaterialCard
        sx={{ height: '100%', position: 'relative', borderRadius: 3, overflow: 'hidden' }}
      >
        {offer.discount && (
          <Box
            sx={{
              position: 'absolute',
              top: 14,
              right: -34,
              transform: 'rotate(45deg)',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              px: 4,
              py: 0.5,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {offer.discount}
          </Box>
        )}
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" gutterBottom>
              {offer.title}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {offer.description ?? offer.subtitle}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            {offer.code && (
              <Chip label={`Code: ${offer.code}`} color="primary" size="small" variant="outlined" />
            )}
            {offer.isExpired ? (
              <Chip label="Expired" color="error" size="small" />
            ) : (
              <Chip label="Active" color="success" size="small" />
            )}
          </Box>
        </Box>
      </MaterialCard>
    </HoverScale>
  )
}

OfferCard.propTypes = {
  offer: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    description: PropTypes.string,
    subtitle: PropTypes.string,
    discount: PropTypes.string,
    code: PropTypes.string,
    isExpired: PropTypes.bool,
  }).isRequired,
}

export default OfferCard
