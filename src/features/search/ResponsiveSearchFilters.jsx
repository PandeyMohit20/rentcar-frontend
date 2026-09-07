import { Box, Button, Drawer, IconButton, Stack, Typography, useMediaQuery } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

export default function ResponsiveSearchFilters({ open, onClose, onExited, children }) {
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('md'))
  if (!mobile) return children
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      slotProps={{
        transition: { onExited },
        paper: {
          'aria-labelledby': 'search-filter-title',
          sx: {
            maxHeight: '90dvh',
            borderRadius: '16px 16px 0 0',
            pb: 'env(safe-area-inset-bottom)',
          },
        },
      }}
    >
      <Box sx={{ overflowY: 'auto', p: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography id="search-filter-title" component="h2" variant="h6">
            Trip and filters
          </Typography>
          <IconButton aria-label="Close filters" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
        {children}
        <Button fullWidth color="inherit" onClick={onClose}>
          Close without applying
        </Button>
      </Box>
    </Drawer>
  )
}
