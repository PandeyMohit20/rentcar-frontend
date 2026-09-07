import { QueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { ERROR_MESSAGES } from '@/constants/errorMessages'

const staleTime = Number(import.meta.env.VITE_QUERY_STALE_TIME) || 60000
const retryCount = Number(import.meta.env.VITE_QUERY_RETRY_COUNT) || 2
const retryQuery = (failureCount, error) => {
  const status = error?.status
  if ([400, 401, 403, 404, 409, 413, 422, 429].includes(status)) return false
  return (
    (error?.isNetworkError || [500, 502, 503, 504].includes(status)) && failureCount < retryCount
  )
}

/**
 * Global TanStack Query client with sensible defaults.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: retryQuery,
      staleTime,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 0,
      onError: (error) => {
        const message = error?.message || ERROR_MESSAGES.GENERIC
        toast.error(message)
      },
    },
  },
})

export default queryClient
