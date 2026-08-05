import PropTypes from 'prop-types'
import { Box, Container, Grid, Typography, Link, Divider } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { APP_NAME } from '@/constants/app'

/**
 * Site footer with navigation and legal links.
 */
function Footer({ links = [], secondaryLinks = [] }) {
  const year = new Date().getFullYear()

  const defaultLinks = [
    { label: 'About Us', to: ROUTES.ABOUT },
    { label: 'Contact', to: ROUTES.CONTACT },
    { label: 'FAQ', to: ROUTES.FAQ },
    { label: 'Blog', to: ROUTES.BLOG },
    { label: 'Offers', to: ROUTES.OFFERS },
  ]

  const defaultSecondary = [
    { label: 'Terms & Conditions', to: ROUTES.LEGAL },
    { label: 'Privacy Policy', to: ROUTES.PRIVACY_POLICY },
    { label: 'Refund Policy', to: ROUTES.REFUND_POLICY },
    { label: 'Cancellation Policy', to: ROUTES.CANCELLATION_POLICY },
  ]

  const footerLinks = links.length ? links : defaultLinks
  const legalLinks = secondaryLinks.length ? secondaryLinks : defaultSecondary

  return (
    <Box
      component="footer"
      sx={{ mt: 8, py: 5, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 800 }}>
              {APP_NAME}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Premium self-drive car rental platform. Book your drive in minutes.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 700 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              {footerLinks.map((link) => (
                <Link
                  key={link.to}
                  component={RouterLink}
                  to={link.to}
                  color="text.secondary"
                  variant="body2"
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 700 }}>
              Policies
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              {legalLinks.map((link) => (
                <Link
                  key={link.to}
                  component={RouterLink}
                  to={link.to}
                  color="text.secondary"
                  variant="body2"
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Typography variant="body2" color="text.secondary" align="center">
          © {year} {APP_NAME}. All rights reserved.
        </Typography>
      </Container>
    </Box>
  )
}

Footer.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired,
    })
  ),
  secondaryLinks: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired,
    })
  ),
}

export default Footer
