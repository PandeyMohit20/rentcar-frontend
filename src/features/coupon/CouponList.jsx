import { memo } from 'react'
import PropTypes from 'prop-types'
import { Box, Typography } from '@mui/material'
import CouponCard from './CouponCard'

/**
 * List of available coupons.
 */
function CouponList({ coupons, onApply, disabled }) {
  if (!coupons || coupons.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No coupons available right now.
      </Typography>
    )
  }

  return (
    <Box aria-label="Available coupons">
      {coupons.map((coupon) => (
        <CouponCard key={coupon.code} coupon={coupon} onApply={onApply} disabled={disabled} />
      ))}
    </Box>
  )
}

CouponList.propTypes = {
  coupons: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      title: PropTypes.string,
      description: PropTypes.string,
    })
  ),
  onApply: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
}

export default memo(CouponList)
