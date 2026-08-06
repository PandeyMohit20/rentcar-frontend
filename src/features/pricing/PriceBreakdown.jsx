import PropTypes from 'prop-types'
import { Box, Typography, Divider, Button, TextField } from '@mui/material'
import { useState } from 'react'
import { formatCurrency } from '@/utils/formatters'

/**
 * Detailed price breakdown for a rental quote.
 * Renders daily/weekly/monthly pricing, deposit, insurance, fee,
 * taxes, discount and a coupon placeholder.
 */
function PriceBreakdown({
  dailyPrice = 0,
  weeklyPrice,
  monthlyPrice,
  securityDeposit = 0,
  insuranceCharge = 0,
  platformFee = 0,
  taxes = 0,
  discount = 0,
  couponDiscount = 0,
  total = 0,
  onApplyCoupon,
  couponError,
}) {
  const [coupon, setCoupon] = useState('')

  const handleApply = (e) => {
    e.preventDefault()
    onApplyCoupon && onApplyCoupon(coupon)
  }

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Price Breakdown
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        {weeklyPrice ? <UnitPill label="Weekly" value={formatCurrency(weeklyPrice)} /> : null}
        {monthlyPrice ? <UnitPill label="Monthly" value={formatCurrency(monthlyPrice)} /> : null}
        <UnitPill label="Per day" value={formatCurrency(dailyPrice)} />
      </Box>

      <StackableRow label="Daily price" value={formatCurrency(dailyPrice)} />
      {typeof securityDeposit === 'number' && securityDeposit > 0 && (
        <StackableRow label="Security deposit" value={formatCurrency(securityDeposit)} />
      )}
      {typeof insuranceCharge === 'number' && insuranceCharge > 0 && (
        <StackableRow label="Insurance" value={formatCurrency(insuranceCharge)} />
      )}
      {typeof platformFee === 'number' && platformFee > 0 && (
        <StackableRow label="Platform fee" value={formatCurrency(platformFee)} />
      )}
      {typeof taxes === 'number' && taxes > 0 && (
        <StackableRow label="Taxes" value={formatCurrency(taxes)} />
      )}
      {discount > 0 && (
        <StackableRow label="Discount" value={`- ${formatCurrency(discount)}`} emphasize />
      )}
      {couponDiscount > 0 && (
        <StackableRow label="Coupon" value={`- ${formatCurrency(couponDiscount)}`} emphasize />
      )}

      <Divider sx={{ my: 1.5 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Typography variant="h6">Total</Typography>
        <Typography variant="h6" color="primary">
          {formatCurrency(total)}
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleApply} sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <TextField
          size="small"
          placeholder="Coupon code"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          error={Boolean(couponError)}
          helperText={couponError || ' '}
          fullWidth
        />
        <Button type="submit" variant="outlined" size="small" disabled={!coupon.trim()}>
          Apply
        </Button>
      </Box>
    </Box>
  )
}

function UnitPill({ label, value }) {
  return (
    <Box
      sx={{
        borderRadius: 1,
        border: 1,
        borderColor: 'divider',
        px: 1.5,
        py: 0.5,
        textAlign: 'center',
      }}
    >
      <Typography variant="caption" display="block" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="subtitle2">{value}</Typography>
    </Box>
  )
}

UnitPill.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
}

function StackableRow({ label, value, emphasize = false }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="body2"
        color={emphasize ? 'success.main' : 'text.primary'}
        fontWeight={emphasize ? 600 : 400}
      >
        {value}
      </Typography>
    </Box>
  )
}

StackableRow.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  emphasize: PropTypes.bool,
}

PriceBreakdown.propTypes = {
  dailyPrice: PropTypes.number,
  weeklyPrice: PropTypes.number,
  monthlyPrice: PropTypes.number,
  securityDeposit: PropTypes.number,
  insuranceCharge: PropTypes.number,
  platformFee: PropTypes.number,
  taxes: PropTypes.number,
  discount: PropTypes.number,
  couponDiscount: PropTypes.number,
  total: PropTypes.number,
  onApplyCoupon: PropTypes.func,
  couponError: PropTypes.string,
}

export default PriceBreakdown
