import { useForm } from 'react-hook-form'
import { Box, Container, Typography, Grid, Alert } from '@mui/material'
import Seo from '@/components/common/Seo'
import FormProvider from '@/components/forms/FormProvider'
import InputField from '@/components/forms/InputField'
import MaterialCard from '@/components/ui/MaterialCard'
import LoadingButton from '@/components/buttons/LoadingButton'
import { supportService } from '@/services/modules'
import { useApiMutation } from '@/hooks/useApi'
import { useToast } from '@/contexts/ToastContext'
import { pageStyles } from './styles'

/**
 * Contact page — inquiry form.
 */
function ContactPage() {
  const { showSuccess, showError } = useToast()
  const methods = useForm({
    defaultValues: { name: '', email: '', subject: '', message: '' },
  })

  const { mutate, isPending } = useApiMutation({
    mutationFn: supportService.submitInquiry,
    onSuccess: () => {
      showSuccess('Your message has been sent. We will get back to you soon.')
      methods.reset()
    },
    onError: (error) => {
      showError(error?.message || 'Failed to send message. Please try again.')
    },
  })

  const onSubmit = (values) => {
    mutate(values)
  }

  return (
    <>
      <Seo title="Contact Us" description="Get in touch with the RentCar team." />
      <Container maxWidth="lg" sx={pageStyles.container}>
        <Typography variant="h4" gutterBottom sx={pageStyles.header}>
          Contact Us
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Box sx={pageStyles.infoBox}>
              <Typography variant="h6" gutterBottom>
                Get in touch
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Have questions about bookings, payments or our fleet? We are here to help.
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Email:</strong> support@rentcar.com
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Phone:</strong> +91 77649 91332
              </Typography>
              <Typography variant="body2">
                <strong>Hours:</strong> Mon–Sun, 24/7
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={7}>
            <MaterialCard sx={pageStyles.formBox}>
              <Alert severity="info" sx={{ mb: 3 }}>
                We typically respond within 24 hours.
              </Alert>
              <FormProvider {...methods}>
                <Box component="form" onSubmit={methods.handleSubmit(onSubmit)}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <InputField name="name" label="Name" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InputField name="email" label="Email" type="email" />
                    </Grid>
                    <Grid item xs={12}>
                      <InputField name="subject" label="Subject" />
                    </Grid>
                    <Grid item xs={12}>
                      <InputField name="message" label="Message" multiline rows={4} />
                    </Grid>
                    <Grid item xs={12}>
                      <LoadingButton type="submit" loading={isPending}>
                        Send Message
                      </LoadingButton>
                    </Grid>
                  </Grid>
                </Box>
              </FormProvider>
            </MaterialCard>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default ContactPage
