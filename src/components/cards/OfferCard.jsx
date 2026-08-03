import PropTypes from 'prop-types'
import { Box, Typography, Chip } from '@mui/material'
import MaterialCard from '@/components/ui/MaterialCard'

/**
 * Card displaying a promotional offer.
 */
function OfferCard({ offer }) {
  return (
    <MaterialCard>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">{offer.title}</Typography>
          {offer.isExpired ? (
            <Chip label="Expired" color="error" size="small" />
          ) : (
            <Chip label="Active" color="success" size="small" />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {offer.description}
        </Typography>
        <Typography variant="caption" color="primary" sx={{ mt: 2, display: 'block' }}>
          Code: {offer.code}
        </Typography>
      </Box>
    </MaterialCard>
  )
}

OfferCard.propTypes = {
  offer: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    code: PropTypes.string,
    isExpired: PropTypes.bool,
  }).isRequired,
}

export default OfferCard
