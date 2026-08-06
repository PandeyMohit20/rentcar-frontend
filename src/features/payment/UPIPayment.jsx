import { memo } from 'react'
import { Box, Typography } from '@mui/material'
import InputField from '@/components/forms/InputField'

/**
 * UPI payment form (placeholder).
 */
function UPIPayment() {
  return (
    <Box aria-label="UPI payment">
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        UPI (Placeholder)
      </Typography>
      <InputField name="upiId" label="UPI ID" placeholder="yourname@bank" />
    </Box>
  )
}

export default memo(UPIPayment)
