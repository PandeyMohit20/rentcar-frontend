import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import CarImageCarousel from './CarImageCarousel'

/**
 * Car media gallery wrapper with 360° viewer placeholder.
 */
function CarGallery({ images = [], alt = 'Car' }) {
  return (
    <Box>
      <CarImageCarousel images={images} alt={alt} />
      <Box
        sx={{
          mt: 2,
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          p: 2,
          textAlign: 'center',
          color: 'text.secondary',
        }}
      >
        <Box component="span" sx={{ display: 'inline-block', mr: 1 }}>
          🎥
        </Box>
        360° view coming soon
      </Box>
    </Box>
  )
}

CarGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  alt: PropTypes.string,
}

export default CarGallery
