import PropTypes from 'prop-types'
import { Box, Typography } from '@mui/material'
import Reveal from '@/components/animations/Reveal'

/**
 * Section heading block with optional eyebrow and subtitle.
 */
function SectionTitle({ eyebrow, title, subtitle, align = 'center', light = false }) {
  return (
    <Reveal>
      <Box sx={{ mb: { xs: 4, md: 6 }, textAlign: align }}>
        {eyebrow && (
          <Typography
            variant="overline"
            component="p"
            color="primary"
            gutterBottom
            sx={{ fontWeight: 700, letterSpacing: 1.5 }}
          >
            {eyebrow}
          </Typography>
        )}
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ color: light ? 'common.white' : 'text.primary', fontWeight: 700 }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="body1"
            color={light ? 'grey.400' : 'text.secondary'}
            sx={{ maxWidth: 640, mx: align === 'center' ? 'auto' : 0 }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Reveal>
  )
}

SectionTitle.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center', 'right']),
  light: PropTypes.bool,
}

export default SectionTitle
