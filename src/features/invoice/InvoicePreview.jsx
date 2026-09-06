import { memo } from 'react'
import PropTypes from 'prop-types'
import { Box, Chip, Divider, Stack, Typography } from '@mui/material'
import { formatCurrency } from '@/utils/formatters'
import { formatBusinessDateTime } from '@/utils/dateTime'

const money = PropTypes.oneOfType([PropTypes.number, PropTypes.string])

function AmountRow({ label, amount, currencyCode, emphasis = false }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 0.75 }}>
      <Typography fontWeight={emphasis ? 700 : 400}>{label}</Typography>
      <Typography fontWeight={emphasis ? 700 : 500}>
        {formatCurrency(amount, currencyCode)}
      </Typography>
    </Box>
  )
}

AmountRow.propTypes = {
  label: PropTypes.string.isRequired,
  amount: money,
  currencyCode: PropTypes.string,
  emphasis: PropTypes.bool,
}

function InvoicePreview({ invoice }) {
  if (!invoice) return null

  const discount = Number(invoice.discount || 0)

  return (
    <Box aria-label={`Invoice ${invoice.invoiceNumber}`}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={1}
      >
        <Box>
          <Typography variant="h6">Invoice</Typography>
          <Typography variant="body2" color="text.secondary">
            {invoice.invoiceNumber}
          </Typography>
        </Box>
        <Chip label={invoice.status || 'issued'} color="success" size="small" />
      </Stack>

      <Stack spacing={0.25} sx={{ my: 2 }}>
        <Typography variant="body2">
          Issued: {formatBusinessDateTime(invoice.invoiceDate)}
        </Typography>
        {invoice.dueDate && (
          <Typography variant="body2">Due: {formatBusinessDateTime(invoice.dueDate)}</Typography>
        )}
      </Stack>

      <Divider />
      <AmountRow
        label="Rental subtotal"
        amount={invoice.subtotal}
        currencyCode={invoice.currencyCode}
      />
      <AmountRow label="Tax" amount={invoice.tax} currencyCode={invoice.currencyCode} />
      {discount > 0 && (
        <AmountRow label="Discount" amount={-discount} currencyCode={invoice.currencyCode} />
      )}
      <Divider />
      <AmountRow
        label="Invoice total"
        amount={invoice.total}
        currencyCode={invoice.currencyCode}
        emphasis
      />
    </Box>
  )
}

InvoicePreview.propTypes = {
  invoice: PropTypes.shape({
    invoiceNumber: PropTypes.string.isRequired,
    subtotal: money,
    tax: money,
    discount: money,
    total: money,
    currencyCode: PropTypes.string,
    status: PropTypes.string,
    invoiceDate: PropTypes.string,
    dueDate: PropTypes.string,
  }),
}

export default memo(InvoicePreview)
