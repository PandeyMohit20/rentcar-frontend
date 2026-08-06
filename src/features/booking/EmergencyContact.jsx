import { memo } from 'react'
import PropTypes from 'prop-types'
import { Box, Typography } from '@mui/material'

/**
 * Emergency contact summary.
 */
function EmergencyContact({ contact }) {
  if (!contact) return null

  return (
    <Box aria-label="Emergency contact">
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Emergency Contact
      </Typography>
      <Typography variant="body2">{contact.contactName}</Typography>
      <Typography variant="body2" color="text.secondary">
        {contact.relation} • {contact.contactPhone}
      </Typography>
    </Box>
  )
}

EmergencyContact.propTypes = {
  contact: PropTypes.shape({
    contactName: PropTypes.string,
    contactPhone: PropTypes.string,
    relation: PropTypes.string,
  }),
}

export default memo(EmergencyContact)
