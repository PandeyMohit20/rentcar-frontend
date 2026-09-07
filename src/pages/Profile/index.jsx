import { Navigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

export default function AccountRedirect() {
  return <Navigate to={ROUTES.MY_PROFILE} replace />
}
