import { useApiMutation, useApiQuery, useQueryClient } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { bookingService, invoiceService, refundService } from '@/services/modules'

export function useMyBookings(params) {
  return useApiQuery({
    queryKey: QUERY_KEYS.BOOKINGS.LIST(params),
    queryFn: () => bookingService.listMyBookings(params),
    placeholderData: (previous) => previous,
  })
}

export function useBookingDetails(id) {
  return useApiQuery({
    queryKey: QUERY_KEYS.BOOKINGS.DETAILS(id),
    queryFn: () => bookingService.getBookingDetails(id),
    enabled: Boolean(id),
    retry: false,
  })
}

export function useBookingRefunds(id) {
  return useApiQuery({
    queryKey: QUERY_KEYS.REFUNDS.FOR_BOOKING(id),
    queryFn: () => refundService.listForBooking(id),
    enabled: Boolean(id),
    retry: false,
    refetchInterval: (query) =>
      query.state.data?.some((refund) => refund.status === 'pending') ? 5000 : false,
  })
}

export function useBookingInvoice(id, enabled = true) {
  return useApiQuery({
    queryKey: QUERY_KEYS.INVOICES.FOR_BOOKING(id),
    queryFn: () => invoiceService.getForBooking(id),
    enabled: Boolean(id) && enabled,
    retry: false,
  })
}

export function useCancelBooking() {
  const queryClient = useQueryClient()

  const refreshArtifacts = (bookingId) => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKINGS.MINE })
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOKINGS.DETAILS(bookingId) })
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REFUNDS.ALL })
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PAYMENTS.ALL })
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INVOICES.ALL })
  }

  return useApiMutation({
    mutationFn: bookingService.cancelBooking,
    onSuccess: (result, variables) => {
      if (result?.booking) {
        queryClient.setQueryData(QUERY_KEYS.BOOKINGS.DETAILS(variables.bookingId), result.booking)
      }
      if (result?.refund) {
        queryClient.setQueryData(QUERY_KEYS.REFUNDS.DETAILS(result.refund.id), result.refund)
        queryClient.setQueryData(
          QUERY_KEYS.REFUNDS.FOR_BOOKING(variables.bookingId),
          (current = []) => [
            result.refund,
            ...current.filter((refund) => refund.id !== result.refund.id),
          ]
        )
      }
      refreshArtifacts(variables.bookingId)
    },
    onError: (_error, variables) => {
      // Cancellation is committed before the provider refund call. Always re-read server truth.
      refreshArtifacts(variables.bookingId)
    },
  })
}
