import { QueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { ERROR_MESSAGES } from '@/constants/errorMessages'

const staleTime = Number(import.meta.env.VITE_QUERY_STALE_TIME) || 60000
const retryCount = Number(import.meta.env.VITE_QUERY_RETRY_COUNT) || 2

/**
 * Global TanStack Query client with sensible defaults.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: retryCount,
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
