import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Grid, Box, Typography, Divider } from '@mui/material'
import { AccountPageShell, ProfileForm } from '@/components/account'
import {
  useProfile,
  useUpdateProfile,
  useEmergencyContact,
  useUpdateEmergencyContact,
} from '@/features/profile'
import { useToast } from '@/contexts/ToastContext'
import { ROUTES } from '@/constants/routes'
import MaterialCard from '@/components/ui/MaterialCard'
import InputField from '@/components/forms/InputField'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema } from '@/validators/userValidator'
import LoadingButton from '@/components/buttons/LoadingButton'

/**
 * Edit Profile page — personal info + emergency contact forms.
 */
function EditProfilePage() {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const { data: profileData } = useProfile()
  const { data: emergencyData } = useEmergencyContact()
  const updateProfile = useUpdateProfile()
  const updateEmergency = useUpdateEmergencyContact()

  const defaultValues = useMemo(
    () => ({
      firstName: profileData?.firstName ?? '',
      lastName: profileData?.lastName ?? '',
      email: profileData?.email ?? '',
      phone: profileData?.phone ?? '',
    }),
    [profileData]
  )

  const emergencyMethods = useForm({
    defaultValues: {
      name: emergencyData?.name ?? '',
      phone: emergencyData?.phone ?? '',
      relationship: emergencyData?.relationship ?? '',
    },
  })

  const handleProfileSubmit = async (values) => {
    try {
      await updateProfile.mutateAsync(values)
      showSuccess('Profile updated successfully.')
      navigate(ROUTES.MY_PROFILE)
    } catch (error) {
      showError(error?.message || 'Failed to update profile.')
    }
  }

  const handleEmergencySubmit = async (values) => {
    try {
      await updateEmergency.mutateAsync(values)
      showSuccess('Emergency contact updated.')
    } catch (error) {
      showError(error?.message || 'Failed to update emergency contact.')
    }
  }

  return (
    <AccountPageShell title="Edit Profile" description="Update your personal information.">
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <MaterialCard sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <ProfileForm
              defaultValues={defaultValues}
              onSubmit={handleProfileSubmit}
              loading={updateProfile.isPending}
            />
          </MaterialCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <MaterialCard sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Emergency Contact
            </Typography>
            <FormProvider {...emergencyMethods}>
              <Box component="form" onSubmit={emergencyMethods.handleSubmit(handleEmergencySubmit)}>
                <InputField name="name" label="Full Name" />
                <InputField name="phone" label="Phone" />
                <InputField name="relationship" label="Relationship" />
                <LoadingButton type="submit" loading={updateEmergency.isPending}>
                  Save Emergency Contact
                </LoadingButton>
              </Box>
            </FormProvider>
          </MaterialCard>
        </Grid>
      </Grid>
    </AccountPageShell>
  )
}

export default EditProfilePage
