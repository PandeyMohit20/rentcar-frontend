import { useMemo, useState } from 'react'
import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { AccountPageShell, WalletCard, TransactionTable } from '@/components/account'
import {
  useWalletBalance,
  useWalletRefunds,
  useWalletTransactions,
  useRechargeWallet,
} from '@/features/wallet'
import { useToast } from '@/contexts/ToastContext'
import MaterialCard from '@/components/ui/MaterialCard'

/**
 * Wallet page — balance, recent transactions and recharge placeholder.
 */
function WalletPage() {
  const { showSuccess, showError } = useToast()
  const { data: balanceData } = useWalletBalance()
  const { data: refundsData } = useWalletRefunds()
  const { data: transactionsData } = useWalletTransactions()
  const recharge = useRechargeWallet()

  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')

  const balance = useMemo(() => balanceData ?? { balance: 0, currency: 'INR' }, [balanceData])
  const transactions = useMemo(() => transactionsData?.transactions ?? [], [transactionsData])
  const refunds = useMemo(() => refundsData?.refunds ?? [], [refundsData])

  const handleRecharge = async () => {
    try {
      await recharge.mutateAsync({ amount: Number(amount) })
      showSuccess('Wallet recharge initiated (placeholder).')
      setOpen(false)
      setAmount('')
    } catch (error) {
      showError(error?.message || 'Recharge failed.')
    }
  }

  return (
    <AccountPageShell title="My Wallet" description="Manage your wallet balance and transactions.">
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <WalletCard
            balance={balance.balance}
            currency={balance.currency}
            onAddMoney={() => setOpen(true)}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <MaterialCard sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            <TransactionTable transactions={transactions} />
          </MaterialCard>
          <MaterialCard sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Refund History
            </Typography>
            {refunds.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No refunds yet.
              </Typography>
            ) : (
              refunds.map((refund) => (
                <Typography key={refund.id} variant="body2">
                  {refund.id} — {refund.status}
                </Typography>
              ))
            )}
          </MaterialCard>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add Money</DialogTitle>
        <DialogContent>
          <TextField
            label="Amount (INR)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleRecharge}
            variant="contained"
            disabled={!amount || recharge.isPending}
          >
            Recharge
          </Button>
        </DialogActions>
      </Dialog>
    </AccountPageShell>
  )
}

export default WalletPage
