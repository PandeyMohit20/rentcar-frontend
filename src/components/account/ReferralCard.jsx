import PropTypes from 'prop-types'
import { Box, Typography, Button } from '@mui/material'
import ShareIcon from '@mui/icons-material/Share'
import MaterialCard from '@/components/ui/MaterialCard'

/**
 * Referral promo card with code and share action.
 */
function ReferralCard({ referral = {}, onShare }) {
  return (
    <MaterialCard sx={{ p: 3, textAlign: 'center' }} hoverable>
      <ShareIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
      <Typography variant="h6" gutterBottom>
        Refer & Earn
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Share your code and earn rewards when friends book.
      </Typography>
      <Typography variant="h5" sx={{ my: 2, letterSpacing: 2 }}>
        {referral.referralCode || 'RC-XXXX'}
      </Typography>
      <Button variant="contained" onClick={onShare}>
        Share
      </Button>
    </MaterialCard>
  )
}

ReferralCard.propTypes = {
  referral: PropTypes.object,
  onShare: PropTypes.func,
}

export default ReferralCard
