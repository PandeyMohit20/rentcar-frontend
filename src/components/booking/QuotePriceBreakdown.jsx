import { Box, Divider, Typography } from '@mui/material'
import TaxBreakdown from '@/features/invoice/TaxBreakdown'
import { formatCurrency } from '@/utils/formatters'

export default function QuotePriceBreakdown({ quote }) {
  const row = (label, amount, emphasis = false) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 0.75 }}>
      <Typography fontWeight={emphasis ? 700 : 400}>{label}</Typography>
      <Typography fontWeight={emphasis ? 800 : 500}>
        {formatCurrency(amount, quote.currencyCode)}
      </Typography>
    </Box>
  )
  return (
    <Box aria-label="Trip price breakdown">
      {quote.duration?.breakdown?.map((unit, index) => (
        <Box key={`${unit.unit}-${index}`}>{row(`${unit.count} × ${unit.unit}`, unit.amount)}</Box>
      ))}
      <Divider sx={{ my: 1 }} />
      {row('Rental subtotal', quote.pricing?.rentalSubtotal)}
      {quote.financialSnapshot?.additionalCharges > 0 &&
        row('Additional charges', quote.financialSnapshot.additionalCharges)}
      {row('Security deposit', quote.pricing?.securityDeposit)}
      <TaxBreakdown snapshot={quote.financialSnapshot} />
      <Divider sx={{ my: 1 }} />
      {row('Total payable', quote.pricing?.payableAmount, true)}
    </Box>
  )
}
