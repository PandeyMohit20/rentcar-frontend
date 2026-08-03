import PropTypes from 'prop-types'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material'

/**
 * Reusable form dialog wrapper.
 */
function FormDialog({
  open,
  title,
  children,
  onSubmit,
  onClose,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {cancelLabel}
        </Button>
        <Button onClick={onSubmit} color="primary" variant="contained">
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

FormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
}

export default FormDialog
