import { Box, Stack, Typography } from '@mui/material'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'

export default function JourneySteps({ active = 0 }) {
  return (
    <Stack
      component="ol"
      aria-label="Booking progress"
      direction="row"
      sx={{ mb: 4, gap: { xs: 1, sm: 3 } }}
    >
      {['Choose car', 'Review quote', 'Payment', 'Confirmation'].map((label, index) => (
        <Stack
          component="li"
          key={label}
          direction="row"
          alignItems="center"
          spacing={1}
          aria-current={index === active ? 'step' : undefined}
          sx={{ flex: { xs: 1, sm: 'initial' }, minWidth: 0 }}
        >
          <Box
            sx={{
              width: 26,
              height: 26,
              flexShrink: 0,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              bgcolor: index <= active ? 'primary.main' : 'action.hover',
              color: index <= active ? 'primary.contrastText' : 'text.secondary',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {index < active ? <CheckRoundedIcon sx={{ fontSize: 16 }} /> : index + 1}
          </Box>
          <Typography
            variant="caption"
            sx={{
              fontWeight: index === active ? 700 : 500,
              display: { xs: index === active ? 'block' : 'none', sm: 'block' },
            }}
          >
            {label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  )
}
