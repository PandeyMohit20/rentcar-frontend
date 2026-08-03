import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Typography, Button, Link } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import Seo from '@/components/common/Seo'
import FormProvider from '@/components/forms/FormProvider'
import InputField from '@/components/forms/InputField'
import CheckboxField from '@/components/forms/CheckboxField'
import { registerSchema } from '@/validators/authValidator'
import { ROUTES } from '@/constants/routes'

/**
 * Register page.
 */
function RegisterPage() {
  const methods = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  })

  const onSubmit = (values) => {
    // API service call will be wired here.
    void values
  }

  return (
    <>
      <Seo title="Create Account" description="Create your RentCar account." />
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom align="center">
          Create Account
        </Typography>
        <FormProvider {...methods}>
          <Box
            component="form"
            onSubmit={methods.handleSubmit(onSubmit)}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <InputField name="firstName" label="First Name" />
            <InputField name="lastName" label="Last Name" />
            <InputField name="email" label="Email" type="email" />
            <InputField name="phone" label="Phone" />
            <InputField name="password" label="Password" type="password" />
            <InputField name="confirmPassword" label="Confirm Password" type="password" />
            <CheckboxField name="acceptTerms" label="I accept the terms and conditions" />
            <Button type="submit" variant="contained" color="primary" size="large">
              Register
            </Button>
          </Box>
        </FormProvider>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link component={RouterLink} to={ROUTES.LOGIN}>
              Sign In
            </Link>
          </Typography>
        </Box>
      </Box>
    </>
  )
}

export default RegisterPage
