import { memo } from 'react'
import { Box, Typography } from '@mui/material'
import SelectField from '@/components/forms/SelectField'

const banks = [
  { value: 'hdfc', label: 'HDFC Bank' },
  { value: 'icici', label: 'ICICI Bank' },
  { value: 'sbi', label: 'State Bank of India' },
  { value: 'axis', label: 'Axis Bank' },
]

/**
 * Net banking selection (placeholder).
 */
function NetBanking() {
  return (
    <Box aria-label="Net banking payment">
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Net Banking (Placeholder)
      </Typography>
      <SelectField name="bank" label="Select Bank" options={banks} />
    </Box>
  )
}

export default memo(NetBanking)
