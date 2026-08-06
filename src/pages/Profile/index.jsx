import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { Box, Container, Typography, Grid, Avatar, CircularProgress, Chip } from '@mui/material'
import Seo from '@/components/common/Seo'
import FormProvider from '@/components/forms/FormProvider'
import InputField from '@/components/forms/InputField'
import MaterialCard from '@/components/ui/MaterialCard'
import LoadingButton from '@/components/buttons/LoadingButton'
import EmptyState from '@/components/common/EmptyState'
import { userService } from '@/services/modules'
import { useApiQuery, useApiMutation } from '@/hooks/useApi'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux'
import { updateUser } from '@/redux/slices/authSlice'
import { useToast } from '@/contexts/ToastContext'
import { profileSchema, changePasswordSchema } from '@/validators/userValidator'
import { initials } from '@/utils/formatters'
import { pageStyles } from './styles'

/**
 * Profile page — view and update account info, and change password.
 */
function ProfilePage() {
  const dispatch = useAppDispatch()
  const { showSuccess, showError } = useToast()
  const authUser = useAppSelector((state) => state.auth.user)

  const { data, isLoading, error } = useApiQuery({
    queryKey: QUERY_KEYS.USER.PROFILE,
    queryFn: userService.getProfile,
  })

  const profile = data?.data ?? data?.user ?? authUser

  const profileMethods = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: useMemo(
      () => ({
        firstName: profile?.firstName ?? '',
        lastName: profile?.lastName ?? '',
        email: profile?.email ?? '',
        phone: profile?.phone ?? '',
      }),
      [profile]
    ),
  })

  const passwordMethods = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      password: '',
      confirmPassword: '',
    },
  })

  const { mutate: updateProfileMutate, isPending: isUpdating } = useApiMutation({
    mutationFn: userService.updateProfile,
    invalidateKeys: [QUERY_KEYS.USER.PROFILE],
    onSuccess: (response) => {
      const updated = response?.data ?? response
      dispatch(updateUser(updated))
      showSuccess('Profile updated successfully.')
    },
    onError: (err) => {
      showError(err?.message || 'Failed to update profile.')
    },
  })

  const { mutate: changePasswordMutate, isPending: isChanging } = useApiMutation({
    mutationFn: userService.changePassword,
    onSuccess: () => {
      showSuccess('Password changed successfully.')
      passwordMethods.reset()
    },
    onError: (err) => {
      showError(err?.message || 'Failed to change password.')
    },
  })

  const onProfileSubmit = (values) => {
    updateProfileMutate(values)
  }

  const onPasswordSubmit = (values) => {
    const { confirmPassword, ...payload } = values
    changePasswordMutate(payload)
  }

  return (
    <>
      <Seo title="Profile" description="Manage your profile and account settings." />
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
            {/* User info card */}
            <Grid item xs={12} md={4}>
              <MaterialCard sx={pageStyles.card}>
                <Box sx={pageStyles.avatarBox}>
                  <Avatar sx={{ width: 64, height: 64 }}>
                    {initials(profile?.firstName, profile?.lastName)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {profile?.firstName} {profile?.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {profile?.email}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={pageStyles.metaItem}>
                  <Typography variant="caption" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body2">{profile?.phone || '—'}</Typography>
                </Box>
                <Box sx={pageStyles.metaItem}>
                  <Typography variant="caption" color="text.secondary">
                    Role
                  </Typography>
                  <Typography variant="body2">{profile?.role || 'customer'}</Typography>
                </Box>
                {profile?.isEmailVerified ? (
                  <Chip label="Email verified" color="success" size="small" />
                ) : (
                  <Chip label="Email not verified" color="default" size="small" />
                )}
              </MaterialCard>
            </Grid>

            {/* Update profile form */}
            <Grid item xs={12} md={8}>
              <MaterialCard sx={pageStyles.card}>
                <Typography variant="h6" gutterBottom>
                  Update Profile
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
                      <Grid item xs={12} sm={6}>
                        <InputField name="email" label="Email" type="email" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
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
            </Grid>

            {/* Change password */}
            <Grid item xs={12}>
              <MaterialCard sx={pageStyles.card}>
                <Typography variant="h6" gutterBottom>
                  Change Password
                </Typography>
                <FormProvider {...passwordMethods}>
                  <Box
                    component="form"
                    onSubmit={passwordMethods.handleSubmit(onPasswordSubmit)}
                    sx={pageStyles.formBox}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <InputField
                          name="currentPassword"
                          label="Current Password"
                          type="password"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <InputField name="password" label="New Password" type="password" />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <InputField
                          name="confirmPassword"
                          label="Confirm New Password"
                          type="password"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <LoadingButton type="submit" loading={isChanging}>
                          Change Password
                        </LoadingButton>
                      </Grid>
                    </Grid>
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
