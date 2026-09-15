import { Box, Button, Container, Typography } from '@mui/material'

export default function MobileBookingCTA({ price, caption, label, onClick, disabled }) {
  return (
    <Box
      sx={{
        display: { xs: 'block', md: 'none' },
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        boxShadow: '0 -4px 24px rgba(16,35,32,.08)',
        pb: 'env(safe-area-inset-bottom)',
      }}
    >
      <Container
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          py: 1.5,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography fontWeight={800}>{price}</Typography>
          <Typography variant="caption" color="text.secondary">
            {caption}
          </Typography>
        </Box>
        <Button variant="contained" onClick={onClick} disabled={disabled} sx={{ flexShrink: 0 }}>
          {label}
        </Button>
      </Container>
    </Box>
  )
}
