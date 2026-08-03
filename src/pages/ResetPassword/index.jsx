import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Typography, Button } from '@mui/material'
import Seo from '@/components/common/Seo'
import FormProvider from '@/components/forms/FormProvider'
import InputField from '@/components/forms/InputField'
import { resetPasswordSchema } from '@/validators/authValidator'

/**
 * Reset password page.
 */
function ResetPasswordPage() {
  const methods = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const onSubmit = (values) => {
    // API service call will be wired here.
    void values
  }

  return (
    <>
      <Seo title="Reset Password" description="Set a new password." />
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom align="center">
          Reset Password
        </Typography>
        <FormProvider {...methods}>
          <Box
            component="form"
            onSubmit={methods.handleSubmit(onSubmit)}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <InputField name="password" label="New Password" type="password" />
            <InputField name="confirmPassword" label="Confirm Password" type="password" />
            <Button type="submit" variant="contained" color="primary" size="large">
              Reset Password
            </Button>
          </Box>
        </FormProvider>
      </Box>
    </>
  )
}

export default ResetPasswordPage
