import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import FullPageLoader from '@/components/loaders/FullPageLoader'

/**
 * Route guard for guest-only pages (login, register).
 * Redirects authenticated users to the home page.
 */
function GuestRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <FullPageLoader />
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return children
}

GuestRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

export default GuestRoute
