import { lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import PageLoader from '@/components/common/PageLoader'

/**
 * Route helper for lazy-loading a page component with a fallback.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const lazyLoad = (importFn) => {
  const Component = lazy(importFn)
  return function LazyWrapper(props) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Component {...props} />
      </Suspense>
    )
  }
}

export function RouteWrapper({ children }) {
  return <>{children}</>
}

RouteWrapper.propTypes = {
  children: PropTypes.node,
}

export default RouteWrapper
