import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Button } from '@mui/material'
import { AccountPageShell, DeleteAccountDialog } from '@/components/account'
import { useToast } from '@/contexts/ToastContext'
import MaterialCard from '@/components/ui/MaterialCard'
import { useAppDispatch } from '@/hooks/useRedux'
import { logout } from '@/redux/slices/authSlice'
import { ROUTES } from '@/constants/routes'

/**
 * Delete Account page — destructive action with confirmation dialog.
 */
function DeleteAccountPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { showSuccess, showError } = useToast()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      // Placeholder: backend deletion not wired yet.
      dispatch(logout())
      showSuccess('Account deletion initiated (placeholder).')
      navigate(ROUTES.HOME)
    } catch (error) {
      showError(error?.message || 'Failed to delete account.')
      setLoading(false)
    }
  }

  return (
    <AccountPageShell
      title="Delete Account"
      description="Permanently remove your account and associated data."
    >
      <MaterialCard sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom color="error">
          Danger Zone
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Deleting your account is permanent and cannot be undone. All your bookings, trips, wallet,
          documents and personal data will be removed.
        </Typography>
        <Button variant="contained" color="error" onClick={() => setOpen(true)}>
          Delete My Account
        </Button>
      </MaterialCard>

      <DeleteAccountDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
        loading={loading}
      />
    </AccountPageShell>
  )
}

export default DeleteAccountPage
