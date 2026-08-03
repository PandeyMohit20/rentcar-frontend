import { Container, Typography } from '@mui/material'
import Seo from '@/components/common/Seo'

/**
 * Notifications page — in-app notifications.
 */
function NotificationsPage() {
  return (
    <>
      <Seo title="Notifications" description="View your notifications and alerts." />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Notifications
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Notifications functionality is under construction.
        </Typography>
      </Container>
    </>
  )
}

export default NotificationsPage
