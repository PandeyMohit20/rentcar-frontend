import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Box, Typography, TextField, Button, CircularProgress, Paper, Stack } from '@mui/material'

import Seo from '@/components/common/Seo'
import { ROUTES } from '@/constants/routes'
import { authService } from '@/services/modules'
import { useToast } from '@/contexts/ToastContext'

/**
 * Verify Email page.
 *
 * Flow:
 * Register
 *   ↓
 * OTP sent to email
 *   ↓
 * Verify Email page
 *   ↓
 * Enter 6 digit OTP
 *   ↓
 * verifyOtp()
 *   ↓
 * Account becomes ACTIVE
 *   ↓
 * Login
 */
function VerifyEmailPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()

  const email = location.state?.email || ''

  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(60)

  const inputRef = useRef(null)

  /**
   * Start countdown when page loads.
   */
  useEffect(() => {
    inputRef.current?.focus()

    const timer = setInterval(() => {
      setCountdown((previous) => {
        if (previous <= 1) {
          clearInterval(timer)
          return 0
        }

        return previous - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  /**
   * If user directly opens /verify-email without coming
   * from registration, send them back to register.
   */
  useEffect(() => {
    if (!email) {
      showError('Email address is missing. Please register again.')
      navigate(ROUTES.REGISTER, { replace: true })
    }
  }, [email, navigate, showError])

  /**
   * Handle OTP input.
   *
   * Only numbers are allowed and maximum length is 6.
   */
  const handleOtpChange = (event) => {
    const value = event.target.value.replace(/\D/g, '').slice(0, 6)

    setOtp(value)
  }

  /**
   * Verify OTP.
   */
  const handleVerify = async (event) => {
    event.preventDefault()

    if (!email) {
      showError('Email address is missing.')
      return
    }

    if (otp.length !== 6) {
      showError('Please enter the 6-digit OTP.')
      return
    }

    try {
      setLoading(true)

      await authService.verifyOtp({
        email,
        purpose: 'email_verification',
        otp,
      })

      showSuccess('Email verified successfully! Please sign in.')

      navigate(ROUTES.LOGIN, {
        replace: true,
        state: {
          email,
          verified: true,
        },
      })
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error?.message ||
        error?.message ||
        'Invalid or expired OTP.'

      showError(message)

      setOtp('')
      inputRef.current?.focus()
    } finally {
      setLoading(false)
    }
  }

  /**
   * Resend verification OTP.
   */
  const handleResend = async () => {
    if (!email || countdown > 0 || resending) {
      return
    }

    try {
      setResending(true)

      await authService.resendVerification(email)

      showSuccess('A new verification OTP has been sent to your email.')

      setOtp('')
      setCountdown(60)

      inputRef.current?.focus()
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error?.message ||
        error?.message ||
        'Unable to resend OTP. Please try again.'

      showError(message)
    } finally {
      setResending(false)
    }
  }

  /**
   * Go back to registration.
   */
  const handleChangeEmail = () => {
    navigate(ROUTES.REGISTER)
  }

  if (!email) {
    return null
  }

  return (
    <>
      <Seo title="Verify Email" />

      <Box
        sx={{
          minHeight: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 460,
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
          }}
        >
          <Stack spacing={3}>
            {/* Header */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" component="h1" fontWeight={700} sx={{ mb: 1 }}>
                Verify Your Email
              </Typography>

              <Typography variant="body1" color="text.secondary">
                We have sent a 6-digit verification code to
              </Typography>

              <Typography
                variant="body1"
                fontWeight={600}
                sx={{
                  mt: 0.5,
                  wordBreak: 'break-word',
                }}
              >
                {email}
              </Typography>
            </Box>

            {/* OTP Form */}
            <Box component="form" onSubmit={handleVerify}>
              <Stack spacing={3}>
                <TextField
                  inputRef={inputRef}
                  fullWidth
                  label="Verification Code"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={handleOtpChange}
                  inputProps={{
                    maxLength: 6,
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                    autoComplete: 'one-time-code',
                  }}
                  disabled={loading}
                  autoFocus
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify Email'}
                </Button>
              </Stack>
            </Box>

            {/* Resend */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Didn't receive the code?
              </Typography>

              {countdown > 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Resend OTP in {countdown}s
                </Typography>
              ) : (
                <Button variant="text" onClick={handleResend} disabled={resending}>
                  {resending ? <CircularProgress size={18} /> : 'Resend OTP'}
                </Button>
              )}
            </Box>

            {/* Change Email */}
            <Box sx={{ textAlign: 'center' }}>
              <Button variant="text" onClick={handleChangeEmail} disabled={loading || resending}>
                Change Email
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </>
  )
}

export default VerifyEmailPage
