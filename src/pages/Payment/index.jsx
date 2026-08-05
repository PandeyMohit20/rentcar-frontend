import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  CircularProgress,
} from '@mui/material'
import Seo from '@/components/common/Seo'
import MaterialCard from '@/components/ui/MaterialCard'
import LoadingButton from '@/components/buttons/LoadingButton'
import { paymentService } from '@/services/modules'
import { useApiQuery, useApiMutation } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { useAppSelector } from '@/hooks/useRedux'
import { useToast } from '@/contexts/ToastContext'
import { ROUTES } from '@/constants/routes'
import { formatCurrency } from '@/utils/formatters'
import { useState } from 'react'
import { pageStyles } from './styles'

/**
 * Payment page — payment gateway integration.
 */
function PaymentPage() {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const draftBooking = useAppSelector((state) => state.booking.draftBooking)
  const selectedPaymentMethod = useAppSelector((state) => state.booking.selectedPaymentMethod)

  const [method, setMethod] = useState(selectedPaymentMethod || '')

  const { data: methodsData, isLoading } = useApiQuery({
    queryKey: QUERY_KEYS.PAYMENTS.METHODS,
    queryFn: paymentService.getPaymentMethods,
  })
  const methods = methodsData?.data ?? methodsData?.methods ?? []

  const { mutate, isPending } = useApiMutation({
    mutationFn: paymentService.createPayment,
    onSuccess: () => {
      showSuccess('Payment successful! Your booking is confirmed.')
      navigate(ROUTES.BOOKING_HISTORY)
    },
    onError: (error) => {
      showError(error?.message || 'Payment failed. Please try again.')
    },
  })

  const handlePay = () => {
    mutate({
      bookingId: draftBooking?.id,
      amount: draftBooking?.totalAmount,
      paymentMethod: method,
    })
  }

  return (
    <>
      <Seo title="Payment" description="Complete your payment securely." />
      <Container maxWidth="md" sx={pageStyles.container}>
        <Typography variant="h4" gutterBottom sx={pageStyles.header}>
          Payment
        </Typography>

        <MaterialCard sx={pageStyles.card}>
          <Typography variant="h6" gutterBottom>
            {formatCurrency(draftBooking?.totalAmount)}
          </Typography>

          {isLoading ? (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <CircularProgress />
            </Box>
          ) : methods.length === 0 ? (
            <RadioGroup value={method} onChange={(e) => setMethod(e.target.value)}>
              <FormControlLabel value="card" control={<Radio />} label="Credit / Debit Card" />
              <FormControlLabel value="upi" control={<Radio />} label="UPI" />
              <FormControlLabel value="netbanking" control={<Radio />} label="Net Banking" />
              <FormControlLabel value="wallet" control={<Radio />} label="Wallet" />
            </RadioGroup>
          ) : (
            <RadioGroup value={method} onChange={(e) => setMethod(e.target.value)}>
              {methods.map((m) => (
                <FormControlLabel
                  key={m.id ?? m.code}
                  value={m.code ?? m.id}
                  control={<Radio />}
                  label={m.label ?? m.name ?? m.code}
                />
              ))}
            </RadioGroup>
          )}

          <Alert severity="info" sx={{ my: 2 }}>
            This is a secure payment. Your card details are encrypted.
          </Alert>

          <LoadingButton onClick={handlePay} loading={isPending} disabled={!method}>
            Pay {formatCurrency(draftBooking?.totalAmount)}
          </LoadingButton>
        </MaterialCard>
      </Container>
    </>
  )
}

export default PaymentPage
