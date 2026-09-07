import { useRef, useState } from 'react'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/hooks/useRedux'
import { logout } from '@/redux/slices/authSlice'
import { authService } from '@/services/modules/authService'
import authSession from '@/services/api/authSession'
import { clearCustomerSession } from '@/services/api/customerSession'
import { ROUTES } from '@/constants/routes'

export default function LogoutButton({ onComplete, ...props }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const guard = useRef(false)
  const [pending, setPending] = useState(false)
  const signOut = async () => {
    if (guard.current) return
    guard.current = true
    setPending(true)
    try {
      await authService.logout()
    } catch {
      // Offline logout still clears all local customer state.
    } finally {
      clearCustomerSession()
      authSession.markSignedOut()
      dispatch(logout())
      onComplete?.()
      navigate(ROUTES.HOME, { replace: true })
      guard.current = false
      setPending(false)
    }
  }
  return (
    <Button color="inherit" {...props} disabled={pending} onClick={signOut}>
      {pending ? 'Signing out…' : 'Sign out'}
    </Button>
  )
}
