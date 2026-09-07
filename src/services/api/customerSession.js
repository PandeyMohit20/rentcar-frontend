import authSession from './authSession'
import quoteSession from './quoteSession'
import bookingAttemptSession from './bookingAttemptSession'
import cancellationAttemptSession from './cancellationAttemptSession'
import { queryClient } from '@/services/queryClient'

export function clearCustomerSession() {
  authSession.clear()
  quoteSession.clear()
  bookingAttemptSession.clearAll()
  cancellationAttemptSession.clear()
  queryClient.clear()
}

