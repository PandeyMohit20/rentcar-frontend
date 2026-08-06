import { memo } from 'react'
import PropTypes from 'prop-types'
import { Box, Typography } from '@mui/material'
import CheckboxField from '@/components/forms/CheckboxField'

/**
 * Checkout terms & privacy acceptance.
 */
function TermsAcceptance() {
  return (
    <Box aria-label="Terms and conditions acceptance">
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Agreements
      </Typography>
      <CheckboxField name="acceptTerms" label="I accept the terms and conditions" />
      <CheckboxField name="acceptPrivacy" label="I accept the privacy policy" />
      <CheckboxField name="acceptCancellation" label="I accept the cancellation policy" />
    </Box>
  )
}

TermsAcceptance.propTypes = {
  // reserved for future customization
  _unused: PropTypes.any,
}

export default memo(TermsAcceptance)
