import PropTypes from 'prop-types'
import { Box, Container, Typography, Breadcrumbs, Link } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { motion } from 'framer-motion'

/**
 * Inner page header with title, optional subtitle, and breadcrumbs.
 */
function PageHeader({ title, subtitle, breadcrumbs = [] }) {
  return (
    <Box
      sx={{
        py: { xs: 5, md: 7 },
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {breadcrumbs.length > 0 && (
            <Breadcrumbs sx={{ mb: 1 }}>
              {breadcrumbs.map((crumb, idx) =>
                idx === breadcrumbs.length - 1 ? (
                  <Typography key={crumb.label ?? idx} color="text.primary">
                    {crumb.label}
                  </Typography>
                ) : (
                  <Link
                    key={crumb.label ?? idx}
                    component={RouterLink}
                    to={crumb.to}
                    color="text.secondary"
                  >
                    {crumb.label}
                  </Link>
                )
              )}
            </Breadcrumbs>
          )}
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 680, mt: 1 }}>
              {subtitle}
            </Typography>
          )}
        </motion.div>
      </Container>
    </Box>
  )
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string.isRequired, to: PropTypes.string })
  ),
}

export default PageHeader
