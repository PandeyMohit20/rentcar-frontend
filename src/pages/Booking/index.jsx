import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Container, Typography } from '@mui/material'
import Seo from '@/components/common/Seo'
import FormProvider from '@/components/forms/FormProvider'
import InputField from '@/components/forms/InputField'
import MaterialCard from '@/components/ui/MaterialCard'
import LoadingButton from '@/components/buttons/LoadingButton'
import { bookingSchema } from '@/validators/bookingValidator'
import { carService, bookingService } from '@/services/modules'
import { useApiQuery, useApiMutation } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { useAppDispatch } from '@/hooks/useRedux'
import { setDraftBooking } from '@/redux/slices/bookingSlice'
import { useToast } from '@/contexts/ToastContext'
import { ROUTES } from '@/constants/routes'
import { pageStyles } from './styles'

/**
 * Booking page — create a booking for a selected car.
 */
function BookingPage() {
  const { carId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { showSuccess, showError } = useToast()

  const { data: carData } = useApiQuery({
    queryKey: QUERY_KEYS.CARS.DETAILS(carId),
    queryFn: () => carService.getCarDetails(carId),
    enabled: Boolean(carId),
  })
  const car = carData?.data ?? carData?.car

  const methods = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      carId: carId ?? '',
      pickupDate: '',
      dropDate: '',
      pickupLocation: '',
      dropLocation: '',
    },
  })

  const { mutate, isPending } = useApiMutation({
    mutationFn: bookingService.createBooking,
    onSuccess: (response) => {
      const booking = response?.data ?? response
      dispatch(setDraftBooking(booking))
      showSuccess('Booking created. Complete your checkout to confirm.')
      navigate(ROUTES.CHECKOUT)
    },
    onError: (error) => {
      showError(error?.message || 'Failed to create booking.')
    },
  })

  const onSubmit = (values) => {
    mutate(values)
  }

  return (
    <>
      <Seo title="Book a Car" description="Book your car with flexible dates and locations." />
      <Container maxWidth="md" sx={pageStyles.container}>
        <Typography variant="h4" gutterBottom sx={pageStyles.header}>
          Book a Car
        </Typography>
        {car && (
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {car.brand} {car.model}
          </Typography>
        )}
        <MaterialCard sx={pageStyles.formCard}>
          <FormProvider {...methods}>
            <Box component="form" onSubmit={methods.handleSubmit(onSubmit)}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <InputField
                  name="pickupDate"
                  label="Pickup Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                />
                <InputField
                  name="dropDate"
                  label="Drop Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                />
                <InputField name="pickupLocation" label="Pickup Location" />
                <InputField name="dropLocation" label="Drop Location" />
                <LoadingButton type="submit" loading={isPending}>
                  Create Booking
                </LoadingButton>
              </Box>
            </Box>
          </FormProvider>
        </MaterialCard>
      </Container>
    </>
  )
}

export default BookingPage
