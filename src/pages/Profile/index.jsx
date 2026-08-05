import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Container, Typography, Avatar, Chip, Grid, CircularProgress } from '@mui/material'
import Seo from '@/components/common/Seo'
import FormProvider from '@/components/forms/FormProvider'
import InputField from '@/components/forms/InputField'
import LoadingButton from '@/components/buttons/LoadingButton'
import MaterialCard from '@/components/ui/MaterialCard'
import EmptyState from '@/components/common/EmptyState'
import { userService } from '@/services/modules'
import { useApiQuery, useApiMutation } from '@/hooks/useApi'
import { useAuth } from '@/hooks/useAuth'
import { useAppDispatch } from '@/hooks/useRedux'
import { updateUser } from '@/redux/slices/authSlice'
import { useToast } from '@/contexts/ToastContext'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { profileSchema, changePasswordSchema } from '@/validators'
import { initials, titleCase } from '@/utils/formatters'
import { formatDate } from '@/utils/date'
import { pageStyles } from './styles'

const profileDefaultValues = { firstName: '', lastName: '', email: '', phone: '' }
const passwordDefaultValues = { currentPassword: '', password: '', confirmPassword: '' }

/**
 * Profile page — user info, edit form and password change.
 */
function ProfilePage() {
  const dispatch = useAppDispatch()
  const { showSuccess, showError } = useToast()
  const { user: authUser } = useAuth()

  const { data, isLoading, error } = useApiQuery({
    queryKey: QUERY_KEYS.USER.PROFILE,
    queryFn: userService.getProfile,
  })

  const profile = data?.data ?? data ?? authUser

  const profileMethods = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: profileDefaultValues,
  })

  const passwordMethods = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: passwordDefaultValues,
  })

  // Populate edit form once profile data is available.
  useEffect(() => {
    if (profile) {
      profileMethods.reset({
        firstName: profile.firstName ?? profile.first_name ?? '',
        lastName: profile.lastName ?? profile.last_name ?? '',
        email: profile.email ?? '',
        phone: profile.phone ?? '',
      })
    }
  }, [profile, profileMethods])

  const { mutate: updateProfile, isPending: isUpdating } = useApiMutation({
    mutationFn: userService.updateProfile,
    invalidateKeys: [QUERY_KEYS.USER.PROFILE],
    onSuccess: (response) => {
      const updated = response?.data ?? response
      dispatch(updateUser(updated))
      showSuccess('Profile updated successfully.')
    },
    onError: (err) => {
      showError(err?.message || 'Failed to update profile. Please try again.')
    },
  })

  const { mutate: changePassword, isPending: isChangingPassword } = useApiMutation({
    mutationFn: userService.changePassword,
    onSuccess: () => {
      passwordMethods.reset()
      showSuccess('Password changed successfully.')
    },
    onError: (err) => {
      showError(err?.message || 'Failed to change password. Please try again.')
    },
  })

  const onProfileSubmit = (values) => {
    updateProfile(values)
  }

  const onPasswordSubmit = (values) => {
    changePassword({
      currentPassword: values.currentPassword,
      password: values.password,
    })
  }

  return (
    <>
      <Seo title="Profile" description="Manage your profile, preferences and documents." />
      <Container maxWidth="lg" sx={pageStyles.container}>
        <Typography variant="h4" gutterBottom sx={pageStyles.header}>
          Profile
        </Typography>

        {isLoading ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <EmptyState title="Unable to load profile" description="Please try again later." />
        ) : (
          <Grid container spacing={3}>
            {/* ── User summary card ─────────────────────────────────────── */}
            <Grid item xs={12} md={4}>
              <MaterialCard sx={pageStyles.card}>
                <Box sx={pageStyles.avatarBox}>
                  <Avatar src={profile?.avatar} sx={{ width: 64, height: 64, fontSize: 24 }}>
                    {initials(
                      profile?.firstName ?? profile?.first_name,
                      profile?.lastName ?? profile?.last_name
                    )}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {[
                        profile?.firstName ?? profile?.first_name,
                        profile?.lastName ?? profile?.last_name,
                      ]
                        .filter(Boolean)
                        .join(' ') || 'User'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {profile?.email}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={pageStyles.metaItem}>
                  <Typography variant="body2" color="text.secondary">
                    Member since
                  </Typography>
                  <Typography variant="body1">
                    {profile?.createdAt ? formatDate(profile.createdAt) : '—'}
                  </Typography>
                </Box>

                <Box sx={pageStyles.metaItem}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={titleCase(profile?.status ?? 'active')}
                    color={profile?.status === 'inactive' ? 'default' : 'success'}
                    size="small"
                  />
                </Box>

                <Box sx={pageStyles.metaItem}>
                  <Typography variant="body2" color="text.secondary">
                    Role
                  </Typography>
                  <Typography variant="body1">{titleCase(profile?.role ?? 'user')}</Typography>
                </Box>
              </MaterialCard>
            </Grid>

            {/* ── Edit profile form ────────────────────────────────────── */}
            <Grid item xs={12} md={8}>
              <MaterialCard sx={pageStyles.card}>
                <Typography variant="h6" gutterBottom>
                  Edit Profile
                </Typography>
                <FormProvider {...profileMethods}>
                  <Box
                    component="form"
                    onSubmit={profileMethods.handleSubmit(onProfileSubmit)}
                    sx={pageStyles.formBox}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <InputField name="firstName" label="First Name" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <InputField name="lastName" label="Last Name" />
                      </Grid>
                      <Grid item xs={12}>
                        <InputField name="email" label="Email" type="email" />
                      </Grid>
                      <Grid item xs={12}>
                        <InputField name="phone" label="Phone" />
                      </Grid>
                      <Grid item xs={12}>
                        <LoadingButton type="submit" loading={isUpdating}>
                          Save Changes
                        </LoadingButton>
                      </Grid>
                    </Grid>
                  </Box>
                </FormProvider>
              </MaterialCard>

              <MaterialCard sx={{ ...pageStyles.card, mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Change Password
                </Typography>
                <FormProvider {...passwordMethods}>
                  <Box
                    component="form"
                    onSubmit={passwordMethods.handleSubmit(onPasswordSubmit)}
                    sx={pageStyles.formBox}
                  >
                    <InputField name="currentPassword" label="Current Password" type="password" />
                    <InputField name="password" label="New Password" type="password" />
                    <InputField
                      name="confirmPassword"
                      label="Confirm New Password"
                      type="password"
                    />
                    <LoadingButton type="submit" loading={isChangingPassword}>
                      Change Password
                    </LoadingButton>
                  </Box>
                </FormProvider>
              </MaterialCard>
            </Grid>
          </Grid>
        )}
      </Container>
    </>
  )
}

export default ProfilePage
