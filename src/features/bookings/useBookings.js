import { useApiQuery, useApiMutation } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { bookingService } from '@/services/modules'

/**
 * Bookings feature hooks.
 */
export function useBookingsHistory(params = {}) {
  return useApiQuery({
    queryKey: QUERY_KEYS.BOOKINGS.HISTORY(params),
    queryFn: () => bookingService.listBookings(params),
  })
}

export function useBookingDetails(id) {
  return useApiQuery({
    queryKey: QUERY_KEYS.BOOKINGS.DETAILS(id),
    queryFn: () => bookingService.getBookingDetails(id),
    enabled: Boolean(id),
  })
}

export function useBookingInvoice(id) {
  return useApiQuery({
    queryKey: QUERY_KEYS.BOOKINGS.DETAILS(id),
    queryFn: () => bookingService.getInvoice(id),
    enabled: Boolean(id),
  })
}

export function useCancelBooking() {
  return useApiMutation({
    mutationFn: bookingService.cancelBooking,
    invalidateKeys: [QUERY_KEYS.BOOKINGS.ALL],
  })
}
