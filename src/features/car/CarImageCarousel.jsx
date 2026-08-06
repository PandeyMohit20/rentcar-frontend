import PropTypes from 'prop-types'
import { useState } from 'react'
import { Box, IconButton } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ImageLazy from '@/components/common/ImageLazy'

/**
 * Pure image carousel with prev/next controls and thumbnails.
 */
function CarImageCarousel({ images = [], alt = 'Car' }) {
  const [active, setActive] = useState(0)
  const count = images.length
  const current = images[active]

  const prev = () => setActive((i) => (i - 1 + count) % count)
  const next = () => setActive((i) => (i + 1) % count)

  if (count === 0) {
    return <Box sx={{ aspectRatio: '16/9', bgcolor: 'divider', borderRadius: 1 }} />
  }

  return (
    <Box>
      <Box sx={{ position: 'relative' }}>
        <ImageLazy src={current} alt={alt} ratio="16/9" />
        {count > 1 && (
          <>
            <IconButton
              onClick={prev}
              aria-label="Previous image"
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255,255,255,0.85)',
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              onClick={next}
              aria-label="Next image"
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255,255,255,0.85)',
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </>
        )}
      </Box>
      {count > 1 && (
        <Box sx={{ display: 'flex', gap: 1, mt: 1, overflowX: 'auto' }}>
          {images.map((img, index) => (
            <Box
              key={index}
              onClick={() => setActive(index)}
              role="button"
              tabIndex={0}
              aria-label={`View image ${index + 1}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setActive(index)
              }}
              sx={{
                width: 64,
                height: 48,
                flexShrink: 0,
                borderRadius: 1,
                overflow: 'hidden',
                cursor: 'pointer',
                border: active === index ? 2 : 1,
                borderColor: active === index ? 'primary.main' : 'divider',
              }}
            >
              <ImageLazy src={img} alt={`${alt} ${index + 1}`} ratio="4/3" />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

CarImageCarousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  alt: PropTypes.string,
}

export default CarImageCarousel
