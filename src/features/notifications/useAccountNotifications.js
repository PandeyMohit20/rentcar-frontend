import { useApiQuery, useApiMutation } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { notificationService } from '@/services/modules'

/**
 * Account notifications feature hooks.
 */
export function useAccountNotifications(params = {}) {
  return useApiQuery({
    queryKey: QUERY_KEYS.USER.NOTIFICATIONS,
    queryFn: () => notificationService.listNotifications(params),
  })
}

export function useUnreadCount() {
  return useApiQuery({
    queryKey: QUERY_KEYS.USER.NOTIFICATIONS,
    queryFn: notificationService.getUnreadCount,
  })
}

export function useMarkNotificationRead() {
  return useApiMutation({
    mutationFn: notificationService.markRead,
    invalidateKeys: [QUERY_KEYS.USER.NOTIFICATIONS],
  })
}

export function useMarkAllNotificationsRead() {
  return useApiMutation({
    mutationFn: notificationService.markAllRead,
    invalidateKeys: [QUERY_KEYS.USER.NOTIFICATIONS],
  })
}
