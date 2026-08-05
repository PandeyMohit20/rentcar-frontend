import PropTypes from 'prop-types'
import { Box, Container, Typography, TextField, Button } from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import Reveal from '@/components/animations/Reveal'

/**
 * Newsletter signup section. Presentational only.
 */
function Newsletter({ title = 'Stay in the loop', subtitle, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    const email = new FormData(e.currentTarget).get('email')?.toString() ?? ''
    if (email && onSubmit) onSubmit(email)
  }

  return (
    <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'primary.main' }}>
      <Container maxWidth="md">
        <Reveal>
          <Box sx={{ textAlign: 'center', color: 'primary.contrastText' }}>
            <EmailIcon sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', mb: 3 }}>
                {subtitle}
              </Typography>
            )}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: 'flex',
                gap: 1.5,
                flexDirection: { xs: 'column', sm: 'row' },
                maxWidth: 520,
                mx: 'auto',
              }}
            >
              <TextField
                name="email"
                type="email"
                placeholder="Enter your email"
                size="small"
                required
                fullWidth
                sx={{
                  bgcolor: 'rgba(255,255,255,0.15)',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    color: 'common.white',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                  },
                  '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.7)' },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ bgcolor: 'common.white', color: 'primary.main', px: 4, whiteSpace: 'nowrap' }}
              >
                Subscribe
              </Button>
            </Box>
          </Box>
        </Reveal>
      </Container>
    </Box>
  )
}

Newsletter.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  onSubmit: PropTypes.func,
}

export default Newsletter
