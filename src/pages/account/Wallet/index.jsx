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
  CircularProgress,
  Divider,
  Stack,
  Chip,
} from '@mui/material'
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded'
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded'
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded'
import { AccountPageShell, TransactionTable } from '@/components/account'
import {
  useWalletBalance,
  useWalletRefunds,
  useWalletTransactions,
  useRechargeWallet,
} from '@/features/wallet'
import { walletService } from '@/services/modules'
import { useToast } from '@/contexts/ToastContext'
import MaterialCard from '@/components/ui/MaterialCard'
import loadRazorpay from '@/utils/loadRazorpay'

const QUICK_AMOUNTS = [500, 1000, 2000, 5000]

function getErrorMessage(error, fallback) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error?.message ||
    error?.message ||
    fallback
  )
}

function WalletPage() {
  const { showSuccess, showError } = useToast()

  const { data: balanceData, refetch: refetchBalance } = useWalletBalance()

  const { data: refundsData } = useWalletRefunds()

  const { data: transactionsData, refetch: refetchTransactions } = useWalletTransactions()

  const recharge = useRechargeWallet()

  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const balance = useMemo(() => balanceData ?? { balance: 0, currency: 'INR' }, [balanceData])

  const transactions = useMemo(() => transactionsData?.transactions ?? [], [transactionsData])

  const refunds = useMemo(() => refundsData?.refunds ?? [], [refundsData])

  const numericAmount = Number(amount)

  const validAmount =
    Number.isFinite(numericAmount) &&
    numericAmount >= 1 &&
    numericAmount <= 100000 &&
    /^\d+(?:\.\d{1,2})?$/.test(String(amount).trim())

  const closeDialog = () => {
    if (recharge.isPending || checkoutOpen) return

    setOpen(false)
    setAmount('')
  }

  const refreshWallet = async () => {
    await Promise.all([refetchBalance(), refetchTransactions()])
  }

  const handleRecharge = async () => {
    if (!validAmount) {
      showError('Enter an amount between ₹1 and ₹1,00,000.')
      return
    }

    try {
      /*
       * Step 1:
       * Backend creates the trusted Razorpay order.
       */
      const created = await recharge.mutateAsync({
        amount: numericAmount.toFixed(2),
      })

      const topup = created?.topup
      const checkout = created?.checkout

      if (!topup?.id || !checkout?.orderId || !checkout?.amount || !checkout?.currency) {
        throw new Error('The payment order response was incomplete. Please try again.')
      }

      /*
       * Step 2:
       * Load Razorpay Checkout using the existing shared loader.
       */
      const Razorpay = await loadRazorpay()

      if (!Razorpay) {
        throw new Error('Razorpay Checkout could not be loaded.')
      }

      setCheckoutOpen(true)

      const provider = new Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: checkout.amount,
        currency: checkout.currency,
        order_id: checkout.orderId,
        name: 'RentCar',
        description: 'Add money to RentCar Wallet',

        theme: {
          color: '#12695b',
        },

        modal: {
          ondismiss: () => {
            setCheckoutOpen(false)
          },
        },

        handler: async (response) => {
          try {
            /*
             * Step 3:
             * Browser callback is NOT trusted by itself.
             * Backend verifies signature + provider payment state.
             */
            const verified = await walletService.verifyTopup({
              topupId: topup.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })

            await refreshWallet()

            const credited =
              verified?.transaction?.amount ?? topup.amount ?? numericAmount.toFixed(2)

            showSuccess(
              `₹${Number(credited).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} added to your wallet successfully.`
            )

            setOpen(false)
            setAmount('')
          } catch (error) {
            showError(
              getErrorMessage(
                error,
                'Payment was received but wallet verification failed. Please retry verification or contact support.'
              )
            )
          } finally {
            setCheckoutOpen(false)
          }
        },
      })

      provider.on('payment.failed', (response) => {
        setCheckoutOpen(false)

        showError(response?.error?.description || 'Payment failed. Your wallet was not credited.')
      })

      provider.open()
    } catch (error) {
      setCheckoutOpen(false)

      showError(getErrorMessage(error, 'Unable to start wallet payment.'))
    }
  }

  return (
    <AccountPageShell
      title="My Wallet"
      description="Add money securely and use your balance for RentCar payments."
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1120,
          mx: 'auto',
        }}
      >
        {/* =====================================================
            WALLET HERO
        ====================================================== */}
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: { xs: 3, md: 4 },
            p: { xs: 3, sm: 4 },
            mb: 3,
            color: '#fff',
            background: 'linear-gradient(135deg, #0b4b41 0%, #12695b 55%, #16806e 100%)',
            boxShadow: '0 18px 45px rgba(11,75,65,0.20)',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: 260,
              height: 260,
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.06)',
              top: -120,
              right: -70,
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              width: 180,
              height: 180,
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.10)',
              right: 90,
              bottom: -120,
            }}
          />

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', sm: 'center' }}
            spacing={3}
            sx={{ position: 'relative', zIndex: 1 }}
          >
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <AccountBalanceWalletRoundedIcon sx={{ fontSize: 20, opacity: 0.9 }} />

                <Typography
                  variant="overline"
                  sx={{
                    color: 'rgba(255,255,255,0.78)',
                    letterSpacing: '0.12em',
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  AVAILABLE BALANCE
                </Typography>
              </Stack>

              <Typography
                sx={{
                  fontSize: {
                    xs: '2.35rem',
                    sm: '3.15rem',
                  },
                  lineHeight: 1.05,
                  letterSpacing: '-0.045em',
                  fontWeight: 800,
                }}
              >
                ₹
                {Number(balance.balance || 0).toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 1.4,
                  color: 'rgba(255,255,255,0.72)',
                  maxWidth: 430,
                }}
              >
                Your RentCar wallet balance is ready to use for your next booking.
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="large"
              startIcon={<AddRoundedIcon />}
              onClick={() => setOpen(true)}
              sx={{
                flexShrink: 0,
                minWidth: 155,
                px: 3,
                py: 1.35,
                borderRadius: 2.5,
                bgcolor: '#fff',
                color: '#0b4b41',
                fontWeight: 800,
                boxShadow: '0 8px 24px rgba(0,0,0,0.16)',
                '&:hover': {
                  bgcolor: '#f5faf8',
                  boxShadow: '0 10px 28px rgba(0,0,0,0.20)',
                },
              }}
            >
              Add Money
            </Button>
          </Stack>
        </Box>

        {/* =====================================================
            SUMMARY STRIP
        ====================================================== */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                height: '100%',
                p: 2.25,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                bgcolor: 'background.paper',
                display: 'flex',
                alignItems: 'center',
                gap: 1.7,
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  flexShrink: 0,
                  borderRadius: 2.25,
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: 'rgba(18,105,91,0.10)',
                  color: '#12695b',
                }}
              >
                <ReceiptLongRoundedIcon />
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Transactions
                </Typography>

                <Typography variant="h6" fontWeight={800} lineHeight={1.2}>
                  {transactions.length}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                height: '100%',
                p: 2.25,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                bgcolor: 'background.paper',
                display: 'flex',
                alignItems: 'center',
                gap: 1.7,
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  flexShrink: 0,
                  borderRadius: 2.25,
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: 'rgba(22,163,74,0.10)',
                  color: 'success.main',
                }}
              >
                <ArrowDownwardRoundedIcon />
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Wallet credits
                </Typography>

                <Typography variant="h6" fontWeight={800} lineHeight={1.2}>
                  {transactions.filter((item) => item.type === 'credit').length}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                height: '100%',
                p: 2.25,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                bgcolor: 'background.paper',
                display: 'flex',
                alignItems: 'center',
                gap: 1.7,
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  flexShrink: 0,
                  borderRadius: 2.25,
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: 'rgba(18,105,91,0.08)',
                  color: '#12695b',
                }}
              >
                <ShieldRoundedIcon />
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Payment security
                </Typography>

                <Typography variant="subtitle1" fontWeight={800} lineHeight={1.2}>
                  Razorpay Secured
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* =====================================================
            TRANSACTIONS
        ====================================================== */}
        <MaterialCard
          elevation={0}
          sx={{
            overflow: 'hidden',
            mb: 3,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3.5,
            bgcolor: 'background.paper',
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{
              xs: 'flex-start',
              sm: 'center',
            }}
            spacing={1.5}
            sx={{
              px: { xs: 2.25, sm: 3 },
              py: 2.5,
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                }}
              >
                Recent Transactions
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Track your latest wallet activity
              </Typography>
            </Box>

            <Chip
              icon={<AccountBalanceWalletRoundedIcon />}
              label={`${transactions.length} ${
                transactions.length === 1 ? 'transaction' : 'transactions'
              }`}
              sx={{
                fontWeight: 700,
                bgcolor: 'rgba(18,105,91,0.08)',
                color: '#12695b',
                border: '1px solid rgba(18,105,91,0.14)',
              }}
            />
          </Stack>

          <Divider />

          <Box
            sx={{
              p: { xs: 1, sm: 2 },
              '& .MuiPaper-root': {
                boxShadow: 'none',
              },
              '& table': {
                minWidth: 650,
              },
              '& th': {
                bgcolor: 'rgba(18,105,91,0.035)',
                fontWeight: 800,
              },
              '& td': {
                py: 1.6,
              },
            }}
          >
            <TransactionTable transactions={transactions} />
          </Box>
        </MaterialCard>

        {/* =====================================================
            SECURITY + REFUNDS
        ====================================================== */}
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={6}>
            <MaterialCard
              elevation={0}
              sx={{
                height: '100%',
                p: 2.5,
                borderRadius: 3.5,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    flexShrink: 0,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: 'rgba(18,105,91,0.10)',
                    color: '#12695b',
                  }}
                >
                  <LockRoundedIcon />
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight={800}>
                    Safe & secure payments
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Wallet top-ups are securely processed through Razorpay.
                  </Typography>
                </Box>
              </Stack>
            </MaterialCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <MaterialCard
              elevation={0}
              sx={{
                height: '100%',
                p: 2.5,
                borderRadius: 3.5,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight={800}>
                    Refund History
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {refunds.length === 0
                      ? 'No refunds have been processed yet.'
                      : `${refunds.length} refund ${refunds.length === 1 ? 'record' : 'records'}`}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 2.25,
                    flexShrink: 0,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: 'action.hover',
                    color: 'text.secondary',
                  }}
                >
                  <ReceiptLongRoundedIcon />
                </Box>
              </Stack>

              {refunds.length > 0 && (
                <Stack spacing={1} sx={{ mt: 2 }}>
                  {refunds.map((refund) => (
                    <Box
                      key={refund.id}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: 'action.hover',
                      }}
                    >
                      <Typography variant="body2" fontWeight={700}>
                        {refund.id}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        {refund.status}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </MaterialCard>
          </Grid>
        </Grid>
      </Box>
      <Dialog
        open={open}
        onClose={closeDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: 'hidden',
          },
        }}
      >
        <Box
          sx={{
            px: 3,
            pt: 3,
            pb: 2,
            background: 'linear-gradient(135deg, rgba(18,105,91,0.14), rgba(18,105,91,0.03))',
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'grid',
              placeItems: 'center',
              mb: 2,
            }}
          >
            <PaymentsRoundedIcon />
          </Box>

          <DialogTitle
            sx={{
              p: 0,
              fontWeight: 800,
            }}
          >
            Add Money
          </DialogTitle>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Add funds to your RentCar wallet securely through Razorpay.
          </Typography>
        </Box>

        <DialogContent sx={{ pt: '24px !important' }}>
          <Typography variant="caption" color="text.secondary" fontWeight={700}>
            SELECT AMOUNT
          </Typography>

          <Grid container spacing={1} sx={{ mt: 0.25, mb: 2.5 }}>
            {QUICK_AMOUNTS.map((value) => (
              <Grid item xs={6} key={value}>
                <Button
                  fullWidth
                  variant={numericAmount === value ? 'contained' : 'outlined'}
                  onClick={() => setAmount(String(value))}
                  disabled={recharge.isPending || checkoutOpen}
                  sx={{
                    py: 1.15,
                    borderRadius: 2,
                    fontWeight: 700,
                  }}
                >
                  ₹{value.toLocaleString('en-IN')}
                </Button>
              </Grid>
            ))}
          </Grid>

          <TextField
            label="Custom Amount"
            type="number"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            inputProps={{
              min: 1,
              max: 100000,
              step: '0.01',
            }}
            InputProps={{
              startAdornment: (
                <Typography
                  sx={{
                    mr: 1,
                    fontWeight: 700,
                  }}
                >
                  ₹
                </Typography>
              ),
            }}
            helperText="Minimum ₹1 • Maximum ₹1,00,000"
            fullWidth
            disabled={recharge.isPending || checkoutOpen}
          />

          {validAmount && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: 'action.hover',
              }}
            >
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Amount to add
                </Typography>

                <Typography variant="subtitle2" fontWeight={800}>
                  ₹
                  {numericAmount.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Typography>
              </Stack>

              <Typography variant="caption" color="text.secondary">
                The same amount you pay will be credited to your wallet.
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 3,
            pt: 1,
          }}
        >
          <Button
            onClick={closeDialog}
            color="inherit"
            disabled={recharge.isPending || checkoutOpen}
          >
            Cancel
          </Button>

          <Button
            onClick={handleRecharge}
            variant="contained"
            disabled={!validAmount || recharge.isPending || checkoutOpen}
            startIcon={
              recharge.isPending || checkoutOpen ? (
                <CircularProgress size={17} color="inherit" />
              ) : (
                <LockRoundedIcon />
              )
            }
            sx={{
              minWidth: 150,
              borderRadius: 2,
              fontWeight: 700,
            }}
          >
            {recharge.isPending
              ? 'Creating Order...'
              : checkoutOpen
                ? 'Payment Open'
                : 'Pay Securely'}
          </Button>
        </DialogActions>
      </Dialog>
    </AccountPageShell>
  )
}

export default WalletPage
