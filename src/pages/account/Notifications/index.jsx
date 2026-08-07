import { useMemo } from 'react'
import { Box, Typography, Button } from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { AccountPageShell, NotificationCard } from '@/components/account'
import { useAccountNotifications, useMarkAllNotificationsRead } from '@/features/notifications'
import { useToast } from '@/contexts/ToastContext'
import EmptyState from '@/components/common/EmptyState'

/**
 * Notifications page — booking, offers, system and security alerts.
 */
function NotificationsPage() {
  const { showSuccess, showError } = useToast()
  const { data } = useAccountNotifications()
  const markAllRead = useMarkAllNotificationsRead()

  const notifications = useMemo(() => data?.notifications ?? [], [data])

  const handleMarkAll = async () => {
    try {
      await markAllRead.mutateAsync()
      showSuccess('All notifications marked as read.')
    } catch (error) {
      showError(error?.message || 'Failed to mark notifications as read.')
    }
  }

  return (
    <AccountPageShell
      title="Notifications"
      description="Stay updated with booking, offers and security alerts."
      actionLabel="Mark all read"
      onAction={handleMarkAll}
    >
      {notifications.length === 0 ? (
        <EmptyState
          icon={NotificationsIcon}
          title="No notifications"
          description="You're all caught up."
        />
      ) : (
        <Box>
          {notifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </Box>
      )}
    </AccountPageShell>
  )
}

export default NotificationsPage
