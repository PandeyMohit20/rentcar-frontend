import { Box, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import Seo from '@/components/common/Seo'
import { ROUTES } from '@/constants/routes'

/**
 * 404 page.
 */
function NotFoundPage() {
  return (
    <>
      <Seo title="Page Not Found" description="The page you requested could not be found." />
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          px: 2,
        }}
      >
        <Typography variant="h1" color="primary" sx={{ fontWeight: 700 }}>
          404
        </Typography>
        <Typography variant="h5" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 420 }}>
          The page you are looking for doesn&apos;t exist or has been moved.
        </Typography>
        <Button component={Link} to={ROUTES.HOME} variant="contained" color="primary">
          Back to Home
        </Button>
      </Box>
    </>
  )
}

export default NotFoundPage
