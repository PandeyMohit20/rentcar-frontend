import PropTypes from 'prop-types'
import { Box, Skeleton, Typography } from '@mui/material'
import { useState } from 'react'

/**
 * Lazy-loading image with skeleton placeholder.
 */
function ImageLazy({ src, alt = '', ratio = '16/9', sx, ...props }) {
  const [loaded, setLoaded] = useState(null)
  const [failedSource, setFailedSource] = useState(null)
  const error = !src || failedSource === src

  return (
    <Box
      sx={{ position: 'relative', width: '100%', aspectRatio: ratio, overflow: 'hidden', ...sx }}
    >
      {loaded !== src && !error && <Skeleton variant="rectangular" width="100%" height="100%" />}
      {error && <Box role="img" aria-label={alt ? `${alt}: image unavailable` : "Image unavailable"} sx={{ height: "100%", display: "grid", placeItems: "center", bgcolor: "action.hover", p: 2 }}><Typography color="text.secondary">Image unavailable</Typography></Box>}
      {!error && (
        <Box
          component="img"
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(src)}
          onError={() => setFailedSource(src)}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loaded === src ? 1 : 0,
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
