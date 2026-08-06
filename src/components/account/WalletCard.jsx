import PropTypes from 'prop-types'
import { Box, Typography, Button } from '@mui/material'
import MaterialCard from '@/components/ui/MaterialCard'
import { formatCurrency } from '@/utils/formatters'

/**
 * Wallet balance summary card.
 */
function WalletCard({ balance = 0, currency = 'INR', onAddMoney }) {
  return (
    <MaterialCard sx={{ p: 3 }} hoverable>
      <Typography variant="overline" color="text.secondary">
        Wallet Balance
      </Typography>
      <Typography variant="h4" sx={{ my: 1 }}>
        {formatCurrency(balance, currency)}
      </Typography>
      <Button variant="contained" color="primary" onClick={onAddMoney}>
        Add Money
      </Button>
    </MaterialCard>
  )
}

WalletCard.propTypes = {
  balance: PropTypes.number,
  currency: PropTypes.string,
  onAddMoney: PropTypes.func,
}

export default WalletCard
