import { useApiQuery, useApiMutation } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { tripService } from '@/services/modules'

/**
 * Trip history feature hooks.
 */
export function useTripHistory() {
  return useApiQuery({
    queryKey: QUERY_KEYS.TRIPS.ALL,
    queryFn: tripService.getTripHistory,
  })
}

export function useTripDetails(id) {
  return useApiQuery({
    queryKey: QUERY_KEYS.TRIPS.DETAILS(id),
    queryFn: () => tripService.getTripDetails(id),
    enabled: Boolean(id),
  })
}

export function useTripTimeline(id) {
  return useApiQuery({
    queryKey: QUERY_KEYS.TRIPS.TIMELINE(id),
    queryFn: () => tripService.getTripTimeline(id),
    enabled: Boolean(id),
  })
}

export function useRateTrip() {
  return useApiMutation({
    mutationFn: ({ id, ...payload }) => tripService.rateTrip(id, payload),
    invalidateKeys: [QUERY_KEYS.TRIPS.ALL],
  })
}
