import { useApiQuery, useApiMutation } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { reviewService } from '@/services/modules'

/**
 * Reviews feature hooks.
 */
export function useMyReviews() {
  return useApiQuery({
    queryKey: QUERY_KEYS.REVIEWS.ALL,
    queryFn: reviewService.listMyReviews,
  })
}

export function useReviewSummary() {
  return useApiQuery({
    queryKey: QUERY_KEYS.REVIEWS.SUMMARY,
    queryFn: reviewService.getReviewSummary,
  })
}

export function useCreateReview() {
  return useApiMutation({
    mutationFn: reviewService.createReview,
    invalidateKeys: [QUERY_KEYS.REVIEWS.ALL, QUERY_KEYS.REVIEWS.SUMMARY],
  })
}

export function useUpdateReview() {
  return useApiMutation({
    mutationFn: ({ id, ...payload }) => reviewService.updateReview(id, payload),
    invalidateKeys: [QUERY_KEYS.REVIEWS.ALL, QUERY_KEYS.REVIEWS.SUMMARY],
  })
}
