import PropTypes from 'prop-types'
import { Box, Container, Typography } from '@mui/material'
import { motion } from 'framer-motion'

/**
 * Full-width hero banner with optional background image and gradient overlay.
 */
function HeroBanner({
  title,
  subtitle,
  image,
  height = 560,
  overlay = 'linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.3))',
  children,
}) {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: height,
        display: 'flex',
        alignItems: 'center',
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: overlay,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 8, md: 12 } }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{ color: 'common.white', fontWeight: 800, mb: 2 }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.85)', maxWidth: 620, mb: 4 }}>
              {subtitle}
            </Typography>
          )}
          {children}
        </motion.div>
      </Container>
    </Box>
  )
}

HeroBanner.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  image: PropTypes.string,
  height: PropTypes.number,
  overlay: PropTypes.string,
  children: PropTypes.node,
}

export default HeroBanner
