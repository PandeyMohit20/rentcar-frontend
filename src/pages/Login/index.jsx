import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Typography, Link, Alert } from '@mui/material'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
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
import authSession from '@/services/api/authSession'
import { formatBusinessDateTime, validateBusinessInterval } from '@/utils/dateTime'
import { clearCustomerSession } from '@/services/api/customerSession'

/**
 * Login page.
 */
function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { showSuccess, showError } = useToast()

  const returningToCar = /^\/cars\/[^/]+$/.test(location.state?.from?.pathname || '')
  const tripParams = new URLSearchParams(location.state?.from?.search || '')
  const tripPickup = tripParams.get('pickup')
  const tripReturn = tripParams.get('return')
  const validTrip = tripPickup && tripReturn && !validateBusinessInterval(tripPickup, tripReturn)
  const methods = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (values) => {
    methods.clearErrors('root')
    try {
      const response = await authService.login(values)
      const data = response?.data ?? response
      const token = data?.token ?? data?.accessToken
      const user = data?.user ?? data?.profile

      if (token) {
        clearCustomerSession()
        authSession.setAccessToken(token)
        dispatch(loginSuccess({ user }))
        showSuccess('Signed in successfully.')
        const requestedPath = location.state?.from?.pathname
        const safePath =
          typeof requestedPath === 'string' &&
          requestedPath.startsWith('/') &&
          !requestedPath.startsWith('//') &&
          !requestedPath.includes('\\')
            ? `${requestedPath}${location.state?.from?.search || ''}`
            : ROUTES.HOME
        navigate(safePath, { replace: true })
      } else {
        dispatch(loginFailure('Login failed. Please try again.'))
        showError('Invalid credentials.')
        methods.setError('root', { message: 'Login failed. Please try again.' })
      }
    } catch (error) {
      dispatch(loginFailure(error?.message || 'Login failed'))
      showError(error?.message || 'Invalid credentials.')
      methods.setError('root', { message: error?.message || 'Login failed. Please try again.' })
    }
  }

  return (
    <>
      <Seo title="Sign In" description="Sign in to your CaronRent account." />
      <Box sx={{ p: 3 }}>
        <Typography component="h1" variant="h4" gutterBottom align="center">
          {returningToCar ? 'Sign in to continue your booking' : 'Welcome back'}
        </Typography>
        <Typography color="text.secondary" align="center" sx={{ mb: 3 }}>
          Your next drive is just a few steps away.
        </Typography>
        {returningToCar && (
          <Box sx={{ p: 2, mb: 3, bgcolor: 'action.hover', borderRadius: 1 }}>
            <Typography variant="subtitle2">Your trip is saved</Typography>
            {validTrip && (
              <>
                <Typography variant="body2">
                  Pickup: {formatBusinessDateTime(tripPickup)}
                </Typography>
                <Typography variant="body2">
                  Return: {formatBusinessDateTime(tripReturn)}
                </Typography>
              </>
            )}
            <Typography variant="caption" color="text.secondary">
              You will return to your selected car. Request a fresh quote before reserving.
            </Typography>
          </Box>
        )}
        {methods.formState.errors.root && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {methods.formState.errors.root.message}
          </Alert>
        )}
        <FormProvider {...methods}>
          <Box
            component="form"
            onSubmit={methods.handleSubmit(onSubmit)}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <InputField name="email" label="Email" type="email" autoComplete="email" />
            <InputField
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
            />
            <LoadingButton type="submit" size="large" loading={methods.formState.isSubmitting}>
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
            <Link component={RouterLink} to={ROUTES.REGISTER} state={location.state}>
              Register
            </Link>
          </Typography>
        </Box>
      </Box>
    </>
  )
}

export default LoginPage
