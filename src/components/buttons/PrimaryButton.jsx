import PropTypes from 'prop-types'
import { Button } from '@mui/material'

/**
 * Primary action button with default styling.
 */
function PrimaryButton({ children, ...props }) {
  return (
    <Button variant="contained" color="primary" {...props}>
      {children}
    </Button>
  )
}

PrimaryButton.propTypes = {
  children: PropTypes.node.isRequired,
}

export default PrimaryButton
