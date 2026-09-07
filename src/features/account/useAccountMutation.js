import { useMutation, useQueryClient } from '@tanstack/react-query'

// Refresh even on an uncertain result; these writes have no idempotency contract.
export function useAccountMutation(mutationFn, keys, onSuccess) {
  const client = useQueryClient()
  return useMutation({
    mutationFn,
    retry: false,
    gcTime: 0,
    onError: () => {}, // Forms own safe, inline error feedback.
    onSuccess,
    onSettled: () => Promise.all(keys.map((queryKey) => client.invalidateQueries({ queryKey }))),
  })
}
