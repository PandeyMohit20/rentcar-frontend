import PropTypes from 'prop-types'
import { Navigate, useLocation } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import FullPageLoader from '@/components/loaders/FullPageLoader'

/**
 * Route guard for guest-only pages (login, register).
 * Preserves the protected destination when login updates authentication.
 */
function GuestRoute({ children }) {
  const { isAuthenticated, isLoading, isRestoring } = useAuth()
  const location = useLocation()

  if (isLoading || isRestoring) {
    return <FullPageLoader />
  }

  if (isAuthenticated) {
    const requestedPath = location.state?.from?.pathname
    const safePath =
      typeof requestedPath === 'string' &&
      requestedPath.startsWith('/') &&
      !requestedPath.startsWith('//') &&
      !requestedPath.includes('\\') &&
      ![ROUTES.LOGIN, ROUTES.REGISTER].includes(requestedPath)
        ? `${requestedPath}${location.state?.from?.search || ''}`
        : ROUTES.HOME
    return <Navigate to={safePath} replace />
  }

  return children
}

GuestRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

export default GuestRoute
