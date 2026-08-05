import PropTypes from 'prop-types'
import { Box, Skeleton } from '@mui/material'
import { useState } from 'react'

/**
 * Lazy-loading image with skeleton placeholder.
 */
function ImageLazy({ src, alt = '', ratio = '16/9', sx, ...props }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <Box
      sx={{ position: 'relative', width: '100%', aspectRatio: ratio, overflow: 'hidden', ...sx }}
    >
      {!loaded && !error && <Skeleton variant="rectangular" width="100%" height="100%" />}
      {!error && (
        <Box
          component="img"
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
          {...props}
        />
      )}
    </Box>
  )
}

ImageLazy.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  ratio: PropTypes.string,
  sx: PropTypes.object,
}

export default ImageLazy
