import { useForm } from 'react-hook-form'
import { Box, Container, Typography, Grid, Alert, CircularProgress } from '@mui/material'
import Seo from '@/components/common/Seo'
import FormProvider from '@/components/forms/FormProvider'
import InputField from '@/components/forms/InputField'
import SelectField from '@/components/forms/SelectField'
import LoadingButton from '@/components/buttons/LoadingButton'
import MaterialCard from '@/components/ui/MaterialCard'
import { supportService } from '@/services/modules'
import { useApiQuery, useApiMutation } from '@/hooks/useApi'
import { useToast } from '@/contexts/ToastContext'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { pageStyles } from './styles'

const inquiryDefaultValues = { name: '', email: '', subject: '', message: '', category: '' }

const CATEGORY_OPTIONS = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'booking', label: 'Booking Support' },
  { value: 'payment', label: 'Payment / Refund' },
  { value: 'account', label: 'Account & Profile' },
  { value: 'vehicle', label: 'Vehicle Issue' },
  { value: 'other', label: 'Other' },
]

/**
 * Support page — help topics, contact info and inquiry form.
 */
function SupportPage() {
  const { showSuccess, showError } = useToast()

  const { data, isLoading, error } = useApiQuery({
    queryKey: QUERY_KEYS.CONTENT.SUPPORT,
    queryFn: supportService.getSupportContent,
  })

  const content = data?.data ?? data ?? {}
  const topics = content.topics ?? content.faqs ?? []

  const methods = useForm({
    defaultValues: inquiryDefaultValues,
  })

  const { mutate, isPending } = useApiMutation({
    mutationFn: supportService.submitInquiry,
    onSuccess: () => {
      showSuccess('Your inquiry has been submitted. We will get back to you soon.')
      methods.reset()
    },
    onError: (err) => {
      showError(err?.message || 'Failed to submit your inquiry. Please try again.')
    },
  })

  const onSubmit = (values) => {
    mutate(values)
  }

  return (
    <>
      <Seo title="Support" description="Get help with bookings, payments and more." />
      <Container maxWidth="lg" sx={pageStyles.container}>
        <Typography variant="h4" gutterBottom sx={pageStyles.header}>
          Support Center
        </Typography>

        <Grid container spacing={3}>
          {/* ── Contact info & help topics ─────────────────────────────── */}
          <Grid item xs={12} md={5}>
            <MaterialCard sx={pageStyles.card}>
              <Typography variant="h6" gutterBottom>
                Get in touch
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Need help with a booking, payment or your account? Our support team is here 24/7.
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Email:</strong> support@rentcar.com
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Phone:</strong> +91 00000 00000
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Hours:</strong> Mon–Sun, 24/7
              </Typography>
            </MaterialCard>

            <MaterialCard sx={{ ...pageStyles.card, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Common topics
              </Typography>
              {isLoading ? (
                <Box sx={{ py: 3, textAlign: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Typography variant="body2" color="text.secondary">
                  Help topics are temporarily unavailable.
                </Typography>
              ) : topics.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No help topics available right now.
                </Typography>
              ) : (
                topics.map((topic) => (
                  <Typography key={topic.id ?? topic.title} variant="body2" sx={pageStyles.topic}>
                    • {topic.title ?? topic.question}
                  </Typography>
                ))
              )}
            </MaterialCard>
          </Grid>

          {/* ── Inquiry form ───────────────────────────────────────────── */}
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
                      <SelectField name="category" label="Category" options={CATEGORY_OPTIONS} />
                    </Grid>
                    <Grid item xs={12}>
                      <InputField name="message" label="Message" multiline rows={4} />
                    </Grid>
                    <Grid item xs={12}>
                      <LoadingButton type="submit" loading={isPending}>
                        Submit Inquiry
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

export default SupportPage
