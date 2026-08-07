import { useMemo } from 'react'
import { Box, Typography } from '@mui/material'
import { AccountPageShell, TransactionTable } from '@/components/account'
import { useWalletTransactions } from '@/features/wallet'
import MaterialCard from '@/components/ui/MaterialCard'

/**
 * Wallet History page — full transaction history table.
 */
function WalletHistoryPage() {
  const { data: transactionsData, isLoading } = useWalletTransactions()
  const transactions = useMemo(() => transactionsData?.transactions ?? [], [transactionsData])

  return (
    <AccountPageShell
      title="Wallet History"
      description="Complete transaction history for your wallet."
    >
      <MaterialCard sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Transaction History
        </Typography>
        <TransactionTable transactions={transactions} loading={isLoading} />
      </MaterialCard>
    </AccountPageShell>
  )
}

export default WalletHistoryPage
