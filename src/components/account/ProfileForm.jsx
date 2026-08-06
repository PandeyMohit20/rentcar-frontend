import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Grid } from '@mui/material'
import FormProvider from '@/components/forms/FormProvider'
import InputField from '@/components/forms/InputField'
import LoadingButton from '@/components/buttons/LoadingButton'
import { profileSchema } from '@/validators/userValidator'

/**
 * Reusable profile edit form.
 */
function ProfileForm({ defaultValues = {}, onSubmit, loading = false }) {
  const methods = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: defaultValues.firstName ?? '',
      lastName: defaultValues.lastName ?? '',
      email: defaultValues.email ?? '',
      phone: defaultValues.phone ?? '',
    },
  })

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={methods.handleSubmit(onSubmit)}>
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
            <LoadingButton type="submit" loading={loading}>
              Save Changes
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>
    </FormProvider>
  )
}

ProfileForm.propTypes = {
  defaultValues: PropTypes.object,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
}

export default ProfileForm
