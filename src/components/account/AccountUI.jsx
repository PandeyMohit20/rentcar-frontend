import { accountControlStyles } from '@/features/account/accountStyles'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import { accountError } from '@/features/account/errors'

export function AccountSection({ title, description, action, children }) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, minWidth: 0, height: '100%' }}>
      {(title || action) && (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
          sx={{ mb: 2 }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" component="h2">
              {title}
            </Typography>
            {description && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {description}
              </Typography>
            )}
          </Box>
          {action}
        </Stack>
      )}
      {children}
    </Paper>
  )
}
export function AccountSkeleton({ rows = 3 }) {
  return (
    <Stack spacing={2} role="status" aria-label="Loading account information">
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} variant="rounded" height={88} />
      ))}
    </Stack>
  )
}
export function AccountError({ error, onRetry, fallback }) {
  return (
    <Alert
      severity="error"
      action={
        onRetry ? (
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        ) : undefined
      }
    >
      {accountError(error, fallback)}
    </Alert>
  )
}
export function AccountConfirm({
  open,
  title,
  message,
  onClose,
  onConfirm,
  pending,
  error,
  confirmLabel = 'Delete',
}) {
  return (
    <Dialog
      sx={accountControlStyles}
      open={open}
      onClose={pending ? undefined : onClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="account-confirm-title"
      aria-describedby="account-confirm-description"
    >
      <DialogTitle id="account-confirm-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="account-confirm-description">{message}</DialogContentText>
        {error && (
          <Box sx={{ mt: 2 }}>
            <AccountError error={error} />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={pending} color="inherit" autoFocus>
          Cancel
        </Button>
        <Button color="error" variant="contained" onClick={onConfirm} disabled={pending}>
          {pending ? 'Deleting…' : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
