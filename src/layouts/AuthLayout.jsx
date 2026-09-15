import { Outlet, Link } from 'react-router-dom'
import { Box, Container, Typography, Button } from '@mui/material'
import Brand from '@/components/common/Brand'

export default function AuthLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <Box
        component="header"
        sx={{
          px: { xs: 2, md: 5 },
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Button component={Link} to="/" color="inherit">
          <Brand />
        </Button>
        <Button component={Link} to="/search" color="inherit">
          Explore cars
        </Button>
      </Box>
      <Container
        maxWidth="sm"
        sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 5 }}
      >
        <Box
          sx={{
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            p: { xs: 0, sm: 2 },
            boxShadow: '0 12px 40px rgba(16,35,32,.04)',
          }}
        >
          {children || <Outlet />}
        </Box>
        <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 3 }}>
          Your next journey starts here. CaronRent.
        </Typography>
      </Container>
    </Box>
  )
}
