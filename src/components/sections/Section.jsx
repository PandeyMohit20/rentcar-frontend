import PropTypes from 'prop-types'
import { Box, Container } from '@mui/material'

/**
 * Reusable section wrapper with consistent vertical rhythm.
 */
function Section({ id, maxWidth = 'lg', bgcolor, sx, children }) {
  return (
    <Box component="section" id={id} sx={{ py: { xs: 6, md: 10 }, bgcolor, ...sx }}>
      <Container maxWidth={maxWidth}>{children}</Container>
    </Box>
  )
}

Section.propTypes = {
  id: PropTypes.string,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', false]),
  bgcolor: PropTypes.string,
  sx: PropTypes.object,
  children: PropTypes.node.isRequired,
}

export default Section
