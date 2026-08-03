import PropTypes from 'prop-types'

/**
 * Composes application-level providers that do not depend on the router
 * or the UI theme. Add global providers here (e.g. analytics, i18n, config).
 */
function AppProviders({ children }) {
  return children
}

AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AppProviders
