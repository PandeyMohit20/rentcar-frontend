import PropTypes from 'prop-types'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material'

/**
 * Delete account confirmation dialog.
 */
function DeleteAccountDialog({ open, onClose, onConfirm, loading = false }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete Account</DialogTitle>
      <DialogContent>
        <DialogContentText>
          This action is permanent and cannot be undone. Your profile, bookings, wallet and all
          associated data will be deleted. Are you sure you want to continue?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={loading}>
          {loading ? 'Deleting…' : 'Delete My Account'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

DeleteAccountDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  loading: PropTypes.bool,
}

export default DeleteAccountDialog
