import { memo } from 'react'
import PropTypes from 'prop-types'
import { Box, Divider, Typography } from '@mui/material'
import { formatCurrency } from '@/utils/formatters'

/**
 * Price summary breakdown.
 */
function PriceSummary({ breakdown }) {
  if (!breakdown) return null

  const rows = breakdown?.rows ?? []

  return (
    <Box aria-label="Price summary">
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Price Summary
      </Typography>
      {rows.map((row) => (
        <Box key={row.label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
          <Typography variant="body2">{row.label}</Typography>
          <Typography variant="body2">{formatCurrency(row.amount)}</Typography>
        </Box>
      ))}
      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body1" fontWeight={600}>
          Grand Total
        </Typography>
        <Typography variant="body1" fontWeight={600} color="primary">
          {formatCurrency(breakdown.grandTotal)}
        </Typography>
      </Box>
    </Box>
  )
}

PriceSummary.propTypes = {
  breakdown: PropTypes.shape({
    rows: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        amount: PropTypes.number,
      })
    ),
    grandTotal: PropTypes.number,
  }),
}

export default memo(PriceSummary)
