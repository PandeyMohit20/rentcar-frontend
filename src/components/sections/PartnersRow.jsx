import PropTypes from 'prop-types'
import { Box, Container, Typography } from '@mui/material'
import Reveal from '@/components/animations/Reveal'

/**
 * Trusted partners / brand logo strip.
 */
function PartnersRow({ title = 'Trusted by leading brands', partners = [] }) {
  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Reveal>
          <Typography
            variant="overline"
            component="p"
            color="text.secondary"
            align="center"
            gutterBottom
            sx={{ fontWeight: 700, letterSpacing: 2 }}
          >
            {title}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: { xs: 2, md: 4 },
              mt: 2,
            }}
          >
            {partners.map((partner, idx) => (
              <Box
                key={partner ?? idx}
                component="span"
                sx={{
                  px: 2,
                  py: 1,
                  color: 'text.secondary',
                  fontWeight: 700,
                  opacity: 0.75,
                  fontSize: { xs: 16, md: 20 },
                }}
              >
                {partner}
              </Box>
            ))}
          </Box>
        </Reveal>
      </Container>
    </Box>
  )
}

PartnersRow.propTypes = {
  title: PropTypes.string,
  partners: PropTypes.arrayOf(PropTypes.string),
}

export default PartnersRow
