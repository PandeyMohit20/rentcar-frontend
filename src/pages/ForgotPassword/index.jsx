import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Typography, Link } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import Seo from '@/components/common/Seo'
import FormProvider from '@/components/forms/FormProvider'
import InputField from '@/components/forms/InputField'
import LoadingButton from '@/components/buttons/LoadingButton'
import { forgotPasswordSchema } from '@/validators/authValidator'
import { ROUTES } from '@/constants/routes'
import { authService } from '@/services/modules'
import { useToast } from '@/contexts/ToastContext'

/**
 * Forgot password page.
 */
function ForgotPasswordPage() {
  const { showSuccess, showError } = useToast()
  const methods = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (values) => {
    try {
      await authService.forgotPassword(values.email)
      showSuccess('If that email exists, a reset link has been sent.')
      methods.reset()
    } catch (error) {
      showError(error?.message || 'Failed to send reset link. Please try again.')
    }
  }

  return (
    <>
      <Seo title="Forgot Password" description="Reset your password." />
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom align="center">
          Forgot Password
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
          Enter your email to receive a reset link.
        </Typography>
        <FormProvider {...methods}>
          <Box
            component="form"
            onSubmit={methods.handleSubmit(onSubmit)}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <InputField name="email" label="Email" type="email" />
            <LoadingButton type="submit" size="large">
              Send Reset Link
            </LoadingButton>
          </Box>
        </FormProvider>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link component={RouterLink} to={ROUTES.LOGIN} variant="body2">
            Back to sign in
          </Link>
        </Box>
      </Box>
    </>
  )
}

export default ForgotPasswordPage
