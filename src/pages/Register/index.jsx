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
import { loginSuccess, loginFailure } from '@/redux/slices/authSlice'
import { useToast } from '@/contexts/ToastContext'
import storage from '@/utils/storage'
import { STORAGE_KEYS } from '@/constants/app'

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
      const { confirmPassword, acceptTerms, ...payload } = values
      const response = await authService.register(payload)
      const data = response?.data ?? response
      const token = data?.token ?? data?.accessToken
      const user = data?.user ?? data?.profile

      if (token) {
        storage.set(STORAGE_KEYS.AUTH_TOKEN, token)
        dispatch(loginSuccess({ user, token }))
        showSuccess('Account created successfully.')
        navigate(ROUTES.HOME)
      } else {
        showSuccess('Account created. Please sign in.')
        navigate(ROUTES.LOGIN)
      }
    } catch (error) {
      dispatch(loginFailure(error?.message || 'Registration failed'))
      showError(error?.message || 'Registration failed. Please try again.')
    }
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
            <LoadingButton type="submit" size="large">
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
