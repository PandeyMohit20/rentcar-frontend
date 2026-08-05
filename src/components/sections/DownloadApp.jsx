import PropTypes from 'prop-types'
import { Box, Container, Grid, Typography, Button } from '@mui/material'
import AppleIcon from '@mui/icons-material/Apple'
import AndroidIcon from '@mui/icons-material/Android'
import Reveal from '@/components/animations/Reveal'

/**
 * Mobile app download call-to-action section.
 */
function DownloadApp({ title, subtitle, image }) {
  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Reveal>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                {title}
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {subtitle}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button variant="contained" color="primary" startIcon={<AppleIcon />} size="large">
                  App Store
                </Button>
                <Button variant="outlined" color="primary" startIcon={<AndroidIcon />} size="large">
                  Google Play
                </Button>
              </Box>
            </Reveal>
          </Grid>
          {image && (
            <Grid item xs={12} md={6}>
              <Reveal direction="slideRight">
                <Box
                  component="img"
                  src={image}
                  alt={title}
                  sx={{ width: '100%', maxWidth: 420, mx: 'auto', display: 'block' }}
                />
              </Reveal>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  )
}

DownloadApp.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  image: PropTypes.string,
}

export default DownloadApp
