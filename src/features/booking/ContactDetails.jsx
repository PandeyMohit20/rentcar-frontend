import { memo } from 'react'
import PropTypes from 'prop-types'
import { Box, Typography } from '@mui/material'

/**
 * Contact details summary.
 */
function ContactDetails({ contact }) {
  if (!contact) return null

  return (
    <Box aria-label="Contact details">
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Contact
      </Typography>
      <Typography variant="body2">{contact.fullName}</Typography>
      <Typography variant="body2" color="text.secondary">
        {contact.email}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {contact.phone}
      </Typography>
    </Box>
  )
}

ContactDetails.propTypes = {
  contact: PropTypes.shape({
    fullName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
  }),
}

export default memo(ContactDetails)
