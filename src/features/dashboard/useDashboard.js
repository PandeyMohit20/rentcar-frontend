import { useApiQuery, useApiMutation } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { dashboardService } from '@/services/modules'

/**
 * Dashboard feature hooks.
 * Wraps dashboard service calls with TanStack Query.
 */
export function useDashboardOverview() {
  return useApiQuery({
    queryKey: QUERY_KEYS.DASHBOARD.OVERVIEW,
    queryFn: dashboardService.getOverview,
  })
}

export function useDashboardWidgets() {
  return useApiQuery({
    queryKey: QUERY_KEYS.DASHBOARD.WIDGETS,
    queryFn: dashboardService.getWidgets,
  })
}

export function useRefreshDashboard() {
  return useApiMutation({
    mutationFn: dashboardService.getOverview,
    invalidateKeys: [QUERY_KEYS.DASHBOARD.OVERVIEW],
  })
}
