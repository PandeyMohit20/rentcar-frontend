import { Stack, Typography } from '@mui/material'
import { formatCurrency } from '@/utils/formatters'

export default function TaxBreakdown({ snapshot }) {
  if (!snapshot) return null
  const f = snapshot
  return (
    <Stack spacing={0.5} sx={{ my: 2 }}>
      {f.policyStatus !== 'confirmed' ? (
        <Typography color="warning.main">
          Tax treatment is awaiting business confirmation.
        </Typography>
      ) : (
        <>
          <Typography>Taxable value: {formatCurrency(f.taxableAmount, f.currency)}</Typography>
          {f.tax.type === 'CGST_SGST' ? (
            <>
              <Typography>
                CGST ({f.tax.cgstRate}%): {formatCurrency(f.tax.cgst, f.currency)}
              </Typography>
              <Typography>
                SGST ({f.tax.sgstRate}%): {formatCurrency(f.tax.sgst, f.currency)}
              </Typography>
            </>
          ) : (
            <Typography>
              IGST ({f.tax.igstRate}%): {formatCurrency(f.tax.igst, f.currency)}
            </Typography>
          )}
        </>
      )}
      <Typography>Total tax: {formatCurrency(f.tax.totalTax, f.currency)}</Typography>
    </Stack>
  )
}
