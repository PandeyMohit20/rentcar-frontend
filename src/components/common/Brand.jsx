import { Box, Stack, Typography } from '@mui/material'
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded'

export default function Brand() {
  return (
    <Stack component="span" direction="row" alignItems="center" spacing={1}>
      <Box
        component="span"
        sx={{
          display: 'grid',
          placeItems: 'center',
          width: 34,
          height: 34,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          borderRadius: 1,
        }}
      >
        <DirectionsCarRoundedIcon fontSize="small" />
      </Box>
      <Typography
        component="span"
        sx={{
          fontSize: '1.2rem',
          fontWeight: 800,
          letterSpacing: '-0.06em',
          color: 'text.primary',
        }}
      >
        CaronRent<span style={{ color: 'var(--color-primary)' }}>.</span>
      </Typography>
    </Stack>
  )
}
