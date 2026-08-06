import PropTypes from 'prop-types'
import { Grid, Skeleton, Box } from '@mui/material'

/**
 * Skeleton grid shown while search results load.
 */
function LoadingSkeleton({ count = 6 }) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item key={index} xs={12} sm={6} md={4}>
          <Box>
            <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 1 }} />
            <Skeleton width="60%" sx={{ mt: 1 }} />
            <Skeleton width="40%" />
            <Skeleton width="80%" />
          </Box>
        </Grid>
      ))}
    </Grid>
  )
}

LoadingSkeleton.propTypes = {
  count: PropTypes.number,
}

export default LoadingSkeleton
