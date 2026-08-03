import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Typography, Button, Link } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import Seo from '@/components/common/Seo'
import FormProvider from '@/components/forms/FormProvider'
import InputField from '@/components/forms/InputField'
import { loginSchema } from '@/validators/authValidator'
import { ROUTES } from '@/constants/routes'

/**
 * Login page.
 */
function LoginPage() {
  const methods = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = (values) => {
    // API service call will be wired here.
    void values
  }

  return (
    <>
      <Seo title="Sign In" description="Sign in to your RentCar account." />
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom align="center">
          Sign In
        </Typography>
        <FormProvider {...methods}>
          <Box
            component="form"
            onSubmit={methods.handleSubmit(onSubmit)}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <InputField name="email" label="Email" type="email" />
            <InputField name="password" label="Password" type="password" />
            <Button type="submit" variant="contained" color="primary" size="large">
              Sign In
            </Button>
          </Box>
        </FormProvider>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link component={RouterLink} to={ROUTES.FORGOT_PASSWORD} variant="body2">
            Forgot password?
          </Link>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Don&apos;t have an account?{' '}
            <Link component={RouterLink} to={ROUTES.REGISTER}>
              Register
            </Link>
          </Typography>
        </Box>
      </Box>
    </>
  )
}

export default LoginPage
