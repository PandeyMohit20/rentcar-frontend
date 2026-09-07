import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Typography } from '@mui/material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Seo from '@/components/common/Seo'
import FormProvider from '@/components/forms/FormProvider'
import InputField from '@/components/forms/InputField'
import { resetPasswordSchema } from '@/validators/authValidator'
import LoadingButton from '@/components/buttons/LoadingButton'
import { authService } from '@/services/modules'
import { useToast } from '@/contexts/ToastContext'
import { ROUTES } from '@/constants/routes'

/**
 * Reset password page.
 */
function ResetPasswordPage() {
  const methods = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()

  const onSubmit = async (values) => {
    const token = searchParams.get('token')
    if (!token) return showError('This password reset link is invalid.')
    try {
      await authService.resetPassword({ token, newPassword: values.password })
      showSuccess('Password reset successfully. Please sign in.')
      navigate(ROUTES.LOGIN, { replace: true })
    } catch (error) {
      showError(error?.message || 'Unable to reset password.')
    }
  }

  return (
    <>
      <Seo title="Reset Password" description="Set a new password." />
      <Box sx={{ p: 3 }}>
        <Typography component="h1" variant="h5" gutterBottom align="center">
          Reset Password
        </Typography>
        <FormProvider {...methods}>
          <Box
            component="form"
            onSubmit={methods.handleSubmit(onSubmit)}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <InputField
              name="password"
              label="New Password"
              type="password"
              autoComplete="new-password"
            />
            <InputField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
            />
            <LoadingButton type="submit" size="large" loading={methods.formState.isSubmitting}>
              Reset Password
            </LoadingButton>
          </Box>
        </FormProvider>
      </Box>
    </>
  )
}

export default ResetPasswordPage
