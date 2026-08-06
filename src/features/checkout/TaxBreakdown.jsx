import { memo } from 'react'
import PropTypes from 'prop-types'
import { Box, Typography } from '@mui/material'
import { formatCurrency } from '@/utils/formatters'

/**
 * Tax breakdown.
 */
function TaxBreakdown({ breakdown }) {
  if (!breakdown) return null

  const rows = breakdown?.taxes ?? []

  return (
    <Box aria-label="Tax breakdown">
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Taxes & Fees
      </Typography>
      {rows.map((row) => (
        <Box key={row.label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
          <Typography variant="body2">{row.label}</Typography>
          <Typography variant="body2">{formatCurrency(row.amount)}</Typography>
        </Box>
      ))}
    </Box>
  )
}

TaxBreakdown.propTypes = {
  breakdown: PropTypes.shape({
    taxes: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        amount: PropTypes.number,
      })
    ),
  }),
}

export default memo(TaxBreakdown)
