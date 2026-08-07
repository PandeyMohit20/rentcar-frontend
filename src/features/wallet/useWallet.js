import { useApiQuery, useApiMutation } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { walletService } from '@/services/modules'

/**
 * Wallet feature hooks.
 */
export function useWalletBalance() {
  return useApiQuery({
    queryKey: QUERY_KEYS.WALLET.BALANCE,
    queryFn: walletService.getBalance,
  })
}

export function useWalletTransactions(params = {}) {
  return useApiQuery({
    queryKey: QUERY_KEYS.WALLET.TRANSACTIONS,
    queryFn: () => walletService.getTransactions(params),
  })
}

export function useWalletRefunds() {
  return useApiQuery({
    queryKey: QUERY_KEYS.WALLET.REFUNDS,
    queryFn: walletService.getRefunds,
  })
}

export function useRechargeWallet() {
  return useApiMutation({
    mutationFn: walletService.recharge,
    invalidateKeys: [QUERY_KEYS.WALLET.BALANCE, QUERY_KEYS.WALLET.TRANSACTIONS],
  })
}
