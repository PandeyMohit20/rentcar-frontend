import { Box, Button, Container, Typography } from '@mui/material'
import Seo from '@/components/common/Seo'

function AccountPageShell({
  title,
  description,
  actionLabel,
  onAction,
  actionIcon: Icon,
  children,
}) {
  return (
    <>
      <Seo title={title} description={description} />
      <Container maxWidth="lg" disableGutters sx={{ py: { xs: 1, md: 2 }, minWidth: 0 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
            mb: 3,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h4"
              component="h1"
              tabIndex={-1}
              sx={{ fontSize: { xs: '1.65rem', sm: '2rem' }, letterSpacing: '-0.03em', mb: 1 }}
            >
              {title}
            </Typography>
            {description && (
              <Typography color="text.secondary" sx={{ maxWidth: 680, overflowWrap: 'anywhere' }}>
                {description}
              </Typography>
            )}
          </Box>
          {actionLabel && onAction && (
            <Button variant="contained" startIcon={Icon ? <Icon /> : undefined} onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </Box>
        {children}
      </Container>
    </>
  )
}
export default AccountPageShell
