import PropTypes from 'prop-types'
import { Box, Container, Grid, Typography } from '@mui/material'
import Reveal from '@/components/animations/Reveal'

/**
 * Statistics band displaying key metrics.
 */
function StatsBand({ bgcolor, sx, stats = [] }) {
  return (
    <Box sx={{ py: { xs: 6, md: 8 }, bgcolor, ...sx }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {stats.map((stat, idx) => (
            <Grid item key={stat.label ?? idx} xs={6} md={3}>
              <Reveal delay={idx * 0.08}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" color="primary" sx={{ fontWeight: 800 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Reveal>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

StatsBand.propTypes = {
  bgcolor: PropTypes.string,
  sx: PropTypes.object,
  stats: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string, label: PropTypes.string })),
}

export default StatsBand
