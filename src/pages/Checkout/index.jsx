import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Grid, Divider } from '@mui/material'
import Seo from '@/components/common/Seo'
import FormProvider from '@/components/forms/FormProvider'
import InputField from '@/components/forms/InputField'
import SelectField from '@/components/forms/SelectField'
import MaterialCard from '@/components/ui/MaterialCard'
import LoadingButton from '@/components/buttons/LoadingButton'
import { checkoutSchema } from '@/validators/bookingValidator'
import { PaymentMethod } from '@/types'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { setPaymentMethod, setCouponCode } from '@/redux/slices/bookingSlice'
import { useToast } from '@/contexts/ToastContext'
import { ROUTES } from '@/constants/routes'
import { formatCurrency } from '@/utils/formatters'
import { pageStyles } from './styles'

const paymentOptions = Object.values(PaymentMethod).map((value) => ({ value, label: value }))

/**
 * Checkout page — review booking and enter billing details.
 */
function CheckoutPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { showSuccess } = useToast()
  const draftBooking = useAppSelector((state) => state.booking.draftBooking)

  const methods = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: '',
      couponCode: '',
      billingName: '',
      billingEmail: '',
      billingPhone: '',
    },
  })

  const onSubmit = (values) => {
    dispatch(setPaymentMethod(values.paymentMethod))
    dispatch(setCouponCode(values.couponCode || null))
    showSuccess('Details saved. Proceeding to payment.')
    navigate(ROUTES.PAYMENT)
  }

  return (
    <>
      <Seo title="Checkout" description="Review your booking and complete checkout." />
      <Container maxWidth="lg" sx={pageStyles.container}>
        <Typography variant="h4" gutterBottom sx={pageStyles.header}>
          Checkout
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <MaterialCard sx={pageStyles.formCard}>
              <FormProvider {...methods}>
                <Box component="form" onSubmit={methods.handleSubmit(onSubmit)}>
                  <Typography variant="h6" gutterBottom>
                    Billing Details
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <InputField name="billingName" label="Full Name" />
                    <InputField name="billingEmail" label="Email" type="email" />
                    <InputField name="billingPhone" label="Phone" />
                    <InputField name="couponCode" label="Coupon Code (optional)" />
                    <SelectField
                      name="paymentMethod"
                      label="Payment Method"
                      options={paymentOptions}
                    />
                    <Divider sx={{ my: 1 }} />
                    <LoadingButton type="submit">Continue to Payment</LoadingButton>
                  </Box>
                </Box>
              </FormProvider>
            </MaterialCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <MaterialCard sx={pageStyles.summaryCard}>
              <Typography variant="h6" gutterBottom>
                Booking Summary
              </Typography>
              {draftBooking ? (
                <>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Booking ID: {draftBooking.id ?? '—'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total: {formatCurrency(draftBooking.totalAmount)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status: {draftBooking.status ?? '—'}
                  </Typography>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No booking draft found. Please create a booking first.
                </Typography>
              )}
            </MaterialCard>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default CheckoutPage
