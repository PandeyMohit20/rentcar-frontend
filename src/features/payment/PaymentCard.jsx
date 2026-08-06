import { memo } from 'react'
import { Box, Typography, Divider } from '@mui/material'
import InputField from '@/components/forms/InputField'

/**
 * Card payment form (placeholder).
 */
function PaymentCard() {
  return (
    <Box aria-label="Card payment">
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Card Details (Placeholder)
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <InputField name="cardNumber" label="Card Number" placeholder="0000 0000 0000 0000" />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <InputField name="cardExpiry" label="Expiry (MM/YY)" placeholder="MM/YY" />
          <InputField name="cardCvv" label="CVV" placeholder="123" />
        </Box>
        <InputField name="cardName" label="Name on Card" />
      </Box>
      <Divider sx={{ my: 2 }} />
      <Typography variant="caption" color="text.secondary">
        This is a placeholder. No real card data is collected.
      </Typography>
    </Box>
  )
}

export default memo(PaymentCard)
