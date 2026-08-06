import { memo } from 'react'
import PropTypes from 'prop-types'
import { Box, Divider, Typography } from '@mui/material'
import { formatCurrency } from '@/utils/formatters'

/**
 * Invoice preview with tax summary and charges.
 */
function InvoicePreview({ invoice }) {
  if (!invoice) return null

  const sections = invoice?.sections ?? []

  return (
    <Box aria-label="Invoice preview">
      <Typography variant="h6" gutterBottom>
        Invoice
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Invoice #: {invoice.reference ?? '—'}
      </Typography>
      {sections.map((section) => (
        <Box key={section.label} sx={{ mt: 1 }}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ textTransform: 'uppercase' }}
          >
            {section.label}
          </Typography>
          {section.items.map((item) => (
            <Box
              key={item.label}
              sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}
            >
              <Typography variant="body2">{item.label}</Typography>
              <Typography variant="body2">{formatCurrency(item.amount)}</Typography>
            </Box>
          ))}
        </Box>
      ))}
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body1" fontWeight={600}>
          Grand Total
        </Typography>
        <Typography variant="body1" fontWeight={600} color="primary">
          {formatCurrency(invoice.grandTotal)}
        </Typography>
      </Box>
    </Box>
  )
}

InvoicePreview.propTypes = {
  invoice: PropTypes.shape({
    reference: PropTypes.string,
    grandTotal: PropTypes.number,
    sections: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        items: PropTypes.arrayOf(
          PropTypes.shape({
            label: PropTypes.string,
            amount: PropTypes.number,
          })
        ),
      })
    ),
  }),
}

export default memo(InvoicePreview)
