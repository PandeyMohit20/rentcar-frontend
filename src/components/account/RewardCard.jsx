import PropTypes from 'prop-types'
import { Box, Typography } from '@mui/material'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import MaterialCard from '@/components/ui/MaterialCard'

/**
 * Reward point balance card.
 */
function RewardCard({ points = 0, onRedeem }) {
  return (
    <MaterialCard sx={{ p: 3 }} hoverable>
      <CardGiftcardIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
      <Typography variant="overline" color="text.secondary">
        Reward Points
      </Typography>
      <Typography variant="h4" sx={{ my: 1 }}>
        {points}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Redeem for discounts and more.
      </Typography>
    </MaterialCard>
  )
}

RewardCard.propTypes = {
  points: PropTypes.number,
  onRedeem: PropTypes.func,
}

export default RewardCard
