import { useForm } from 'react-hook-form'
import { Box, Container, Typography, Grid, Alert, CircularProgress } from '@mui/material'
import Seo from '@/components/common/Seo'
import FormProvider from '@/components/forms/FormProvider'
import InputField from '@/components/forms/InputField'
import MaterialCard from '@/components/ui/MaterialCard'
import LoadingButton from '@/components/buttons/LoadingButton'
import EmptyState from '@/components/common/EmptyState'
import { supportService } from '@/services/modules'
import { useApiQuery, useApiMutation } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { useToast } from '@/contexts/ToastContext'
import { pageStyles } from './styles'

/**
 * Support page — contact info and inquiry form.
 */
function SupportPage() {
  const { showSuccess, showError } = useToast()

  const { data, isLoading, error } = useApiQuery({
    queryKey: QUERY_KEYS.CONTENT.SUPPORT,
    queryFn: supportService.getSupportContent,
  })

  const support = data?.data ?? data ?? {}

  const methods = useForm({
    defaultValues: { name: '', email: '', subject: '', message: '' },
  })

  const { mutate, isPending } = useApiMutation({
    mutationFn: supportService.submitInquiry,
    onSuccess: () => {
      showSuccess('Your support request has been submitted. We will get back to you soon.')
      methods.reset()
    },
    onError: (err) => {
      showError(err?.message || 'Failed to submit your request. Please try again.')
    },
  })

  const onSubmit = (values) => {
    mutate(values)
  }

  const faqs = support.faqs ?? support.topics ?? support.helpTopics ?? []

  return (
    <>
      <Seo title="Support" description="Get help with bookings, payments and more." />
      <Container maxWidth="lg" sx={pageStyles.container}>
        <Typography variant="h4" gutterBottom sx={pageStyles.header}>
          Support
        </Typography>

        {isLoading ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <EmptyState title="Unable to load support" description="Please try again later." />
        ) : (
          <Grid container spacing={3}>
            {/* Support info */}
            <Grid item xs={12} md={5}>
              <Box sx={pageStyles.infoBox}>
                <MaterialCard sx={pageStyles.card}>
                  <Typography variant="h6" gutterBottom>
                    How can we help?
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {support.phone && (
                      <>
                        <strong>Phone:</strong> {support.phone}
                      </>
                    )}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Email:</strong> {support.email ?? 'support@rentcar.com'}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Hours:</strong> {support.hours ?? 'Mon–Sun, 24/7'}
                  </Typography>
                </MaterialCard>
              </Box>

              {faqs.length > 0 && (
                <MaterialCard sx={pageStyles.card}>
                  <Typography variant="h6" gutterBottom>
                    Common Topics
                  </Typography>
                  {faqs.map((faq) => (
                    <Box key={faq.id ?? faq.question ?? faq.title} sx={pageStyles.topic}>
                      <Typography variant="subtitle2">{faq.question ?? faq.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {faq.answer ?? faq.description}
                      </Typography>
                    </Box>
                  ))}
                </MaterialCard>
              )}
            </Grid>

            {/* Inquiry form */}
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
                          Submit Request
                        </LoadingButton>
                      </Grid>
                    </Grid>
                  </Box>
                </FormProvider>
              </MaterialCard>
            </Grid>
          </Grid>
        )}
      </Container>
    </>
  )
}

export default SupportPage
