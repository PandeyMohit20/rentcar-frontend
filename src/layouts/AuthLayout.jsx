import PropTypes from 'prop-types'
import { Outlet } from 'react-router-dom'
import { Box, Container, Typography } from '@mui/material'
import { APP_NAME } from '@/constants/app'

/**
 * Minimal layout for authentication pages (login, register).
 */
function AuthLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: 2,
      }}
    >
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        {APP_NAME}
      </Typography>
      <Container maxWidth="sm" disableGutters>
        {children || <Outlet />}
      </Container>
    </Box>
  )
}

AuthLayout.propTypes = {
  children: PropTypes.node,
}

export default AuthLayout
