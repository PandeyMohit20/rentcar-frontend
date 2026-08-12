import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Typography, Link } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'

import Seo from '@/components/common/Seo'
import FormProvider from '@/components/forms/FormProvider'
import InputField from '@/components/forms/InputField'
import CheckboxField from '@/components/forms/CheckboxField'
import LoadingButton from '@/components/buttons/LoadingButton'

import { registerSchema } from '@/validators/authValidator'
import { ROUTES } from '@/constants/routes'
import { authService } from '@/services/modules'

import { useAppDispatch } from '@/hooks/useRedux'
import { loginFailure } from '@/redux/slices/authSlice'

import { useToast } from '@/contexts/ToastContext'

/**
 * Register page.
 */
function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()

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

  const onSubmit = async (values) => {
    try {
      const { firstName, lastName } = values

      // Convert frontend firstName + lastName
      // into the name field expected by the backend.
      const payload = {
        name: `${firstName} ${lastName}`.trim(),
        email: values.email,
        phone: values.phone,
        password: values.password,
      }

      // Register account
      const response = await authService.register(payload)

      const data = response?.data ?? response
      const user = data?.user

      console.log('Registration successful:', user)

      // Account is pending until email verification.
      showSuccess('Account created successfully! Please check your email for the verification OTP.')

      // Go to OTP verification page.
      navigate(ROUTES.VERIFY_EMAIL, {
        state: {
          email: payload.email,
        },
      })
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Registration failed'

      dispatch(loginFailure(message))

      showError(message)
    }
  }

  return (
    <>
      <Seo title="Create Account" />

      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Create Account
        </Typography>

        <FormProvider {...methods}>
          <Box
            component="form"
            onSubmit={methods.handleSubmit(onSubmit)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <InputField name="firstName" label="First Name" placeholder="Enter your first name" />

            <InputField name="lastName" label="Last Name" placeholder="Enter your last name" />

            <InputField name="email" label="Email" type="email" placeholder="Enter your email" />

            <InputField name="phone" label="Phone" placeholder="Enter your phone number" />

            <InputField
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
            />

            <InputField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
            />

            <CheckboxField name="acceptTerms" label="I agree to the Terms and Conditions" />

            <LoadingButton type="submit" loading={methods.formState.isSubmitting} fullWidth>
              Register
            </LoadingButton>
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
