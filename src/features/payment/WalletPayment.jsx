import { memo } from 'react'
import { Box, Typography } from '@mui/material'
import SelectField from '@/components/forms/SelectField'

const wallets = [
  { value: 'paytm', label: 'Paytm' },
  { value: 'phonepe', label: 'PhonePe' },
  { value: 'amazonpay', label: 'Amazon Pay' },
  { value: 'gpay', label: 'Google Pay' },
]

/**
 * Wallet payment selection (placeholder).
 */
function WalletPayment() {
  return (
    <Box aria-label="Wallet payment">
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Wallet (Placeholder)
      </Typography>
      <SelectField name="walletProvider" label="Select Wallet" options={wallets} />
    </Box>
  )
}

export default memo(WalletPayment)
