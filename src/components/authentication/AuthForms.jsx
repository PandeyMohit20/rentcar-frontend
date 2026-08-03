import PropTypes from 'prop-types'
import { Box } from '@mui/material'

/**
 * Shared container for authentication forms.
 */
function AuthForms({ children, maxWidth = 420 }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh',
        px: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth }}>{children}</Box>
    </Box>
  )
}

AuthForms.propTypes = {
  children: PropTypes.node,
  maxWidth: PropTypes.number,
}

export default AuthForms
