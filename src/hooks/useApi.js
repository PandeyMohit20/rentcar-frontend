import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

/**
 * Typed wrapper around TanStack Query hooks.
 * Keeps all query usage consistent across the app.
 */
export function useApiQuery({ queryKey, queryFn, enabled = true, ...options }) {
  return useQuery({
    queryKey,
    queryFn,
    enabled,
    ...options,
  })
}

export function useApiMutation({ mutationFn, onSuccess, onError, onSettled, invalidateKeys = [] }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: (data, variables, context) => {
      if (invalidateKeys.length) {
        invalidateKeys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }))
      }
      if (onSuccess) onSuccess(data, variables, context)
    },
    onError,
    onSettled,
  })
}

export { useQueryClient }
