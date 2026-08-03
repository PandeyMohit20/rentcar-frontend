import PropTypes from 'prop-types'
import { Button, CircularProgress } from '@mui/material'

/**
 * Button with built-in loading state.
 */
function LoadingButton({ loading, children, ...props }) {
  return (
    <Button
      variant="contained"
      color="primary"
      disabled={loading || props.disabled}
      startIcon={loading ? <CircularProgress size={18} color="inherit" /> : props.startIcon}
      {...props}
    >
      {children}
    </Button>
  )
}

LoadingButton.propTypes = {
  loading: PropTypes.bool,
  children: PropTypes.node.isRequired,
}

export default LoadingButton
