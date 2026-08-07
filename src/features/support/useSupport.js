import { useApiQuery, useApiMutation } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { supportService } from '@/services/modules'

/**
 * Support feature hooks.
 */
export function useTickets() {
  return useApiQuery({
    queryKey: QUERY_KEYS.SUPPORT.TICKETS,
    queryFn: supportService.getTickets,
  })
}

export function useTicketDetails(id) {
  return useApiQuery({
    queryKey: QUERY_KEYS.SUPPORT.TICKET_DETAILS(id),
    queryFn: () => supportService.getTicketDetails(id),
    enabled: Boolean(id),
  })
}

export function useSupportFaqs() {
  return useApiQuery({
    queryKey: QUERY_KEYS.SUPPORT.FAQS,
    queryFn: supportService.getFaqs,
  })
}

export function useCreateTicket() {
  return useApiMutation({
    mutationFn: supportService.createTicket,
    invalidateKeys: [QUERY_KEYS.SUPPORT.TICKETS],
  })
}

export function useReplyToTicket() {
  return useApiMutation({
    mutationFn: ({ id, ...payload }) => supportService.replyToTicket(id, payload),
    invalidateKeys: [QUERY_KEYS.SUPPORT.TICKETS],
  })
}
