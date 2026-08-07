import { useApiQuery, useApiMutation } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { rewardService } from '@/services/modules'

/**
 * Rewards feature hooks.
 */
export function useRewardBalance() {
  return useApiQuery({
    queryKey: QUERY_KEYS.REWARDS.BALANCE,
    queryFn: rewardService.getBalance,
  })
}

export function useRewardHistory() {
  return useApiQuery({
    queryKey: QUERY_KEYS.REWARDS.HISTORY,
    queryFn: rewardService.getRewardHistory,
  })
}

export function useRedeemReward() {
  return useApiMutation({
    mutationFn: rewardService.redeem,
    invalidateKeys: [QUERY_KEYS.REWARDS.BALANCE, QUERY_KEYS.REWARDS.HISTORY],
  })
}
