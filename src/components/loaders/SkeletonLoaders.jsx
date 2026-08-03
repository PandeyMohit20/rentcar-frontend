import PropTypes from 'prop-types'
import { Box, Skeleton } from '@mui/material'

/**
 * Collection of skeleton loaders for various UI blocks.
 */
function SkeletonLoaders({ variant = 'card', count = 3 }) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <Box sx={{ width: '100%' }}>
            <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2 }} />
            <Box sx={{ pt: 2 }}>
              <Skeleton width="60%" height={24} />
              <Skeleton width="40%" height={18} />
              <Skeleton width="80%" height={18} />
            </Box>
          </Box>
        )
      case 'table':
        return (
          <Box sx={{ width: '100%' }}>
            {Array.from({ length: count }).map((_, i) => (
              <Skeleton key={i} height={48} sx={{ mb: 1 }} />
            ))}
          </Box>
        )
      case 'list':
        return (
          <Box sx={{ width: '100%' }}>
            {Array.from({ length: count }).map((_, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flexGrow: 1 }}>
                  <Skeleton width="80%" height={20} />
                  <Skeleton width="50%" height={16} />
                </Box>
              </Box>
            ))}
          </Box>
        )
      default:
        return <Skeleton variant="rectangular" width="100%" height={120} />
    }
  }

  return (
    <Box data-testid="skeleton-loader" role="status" aria-label="Loading">
      {renderSkeleton()}
    </Box>
  )
}

SkeletonLoaders.propTypes = {
  variant: PropTypes.oneOf(['card', 'table', 'list']),
  count: PropTypes.number,
}

export default SkeletonLoaders
