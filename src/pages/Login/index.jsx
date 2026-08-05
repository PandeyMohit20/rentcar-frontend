import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Typography, Link } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import Seo from '@/components/common/Seo'
import FormProvider from '@/components/forms/FormProvider'
import InputField from '@/components/forms/InputField'
import LoadingButton from '@/components/buttons/LoadingButton'
import { loginSchema } from '@/validators/authValidator'
import { ROUTES } from '@/constants/routes'
import { authService } from '@/services/modules'
import { useAppDispatch } from '@/hooks/useRedux'
import { loginSuccess, loginFailure } from '@/redux/slices/authSlice'
import { useToast } from '@/contexts/ToastContext'
import storage from '@/utils/storage'
import { STORAGE_KEYS } from '@/constants/app'

/**
 * Login page.
 */
function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()

  const methods = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (values) => {
    try {
      const response = await authService.login(values)
      const data = response?.data ?? response
      const token = data?.token ?? data?.accessToken
      const user = data?.user ?? data?.profile

      if (token) {
        storage.set(STORAGE_KEYS.AUTH_TOKEN, token)
        dispatch(loginSuccess({ user, token }))
        showSuccess('Signed in successfully.')
        navigate(ROUTES.HOME)
      } else {
        dispatch(loginFailure('Login failed. Please try again.'))
        showError('Invalid credentials.')
      }
    } catch (error) {
      dispatch(loginFailure(error?.message || 'Login failed'))
      showError(error?.message || 'Invalid credentials.')
    }
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
            <LoadingButton type="submit" size="large">
              Sign In
            </LoadingButton>
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
