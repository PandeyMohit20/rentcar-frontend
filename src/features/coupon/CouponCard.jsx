import { memo } from 'react'
import PropTypes from 'prop-types'
import { Box, Typography, Button, Chip } from '@mui/material'

/**
 * Single available coupon card.
 */
function CouponCard({ coupon, onApply, disabled }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        mb: 1,
      }}
      aria-label={`Coupon ${coupon.code}`}
    >
      <Box>
        <Typography variant="subtitle2">{coupon.title}</Typography>
        <Chip label={coupon.code} size="small" variant="outlined" sx={{ mt: 0.5 }} />
        {coupon.description && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            {coupon.description}
          </Typography>
        )}
      </Box>
      <Button size="small" variant="outlined" disabled={disabled} onClick={() => onApply(coupon)}>
        Apply
      </Button>
    </Box>
  )
}

CouponCard.propTypes = {
  coupon: PropTypes.shape({
    code: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  onApply: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
}

export default memo(CouponCard)
