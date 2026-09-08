import { useState } from 'react'
import { Box, Button, MenuItem, Stack, TextField, Typography, Alert } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { AccountSection, AccountError } from '@/components/account/AccountUI'
import { setAccountFieldErrors } from '@/features/account/errors'
import { hasValidPaymentPhone } from '@/features/payment/phonePrerequisite'

const personalSchema = z.object({
  dateOfBirth: z
    .string()
    .refine(
      (value) =>
        !value ||
        (/^\d{4}-\d{2}-\d{2}$/.test(value) &&
          !Number.isNaN(Date.parse(value)) &&
          new Date(value).toISOString().slice(0, 10) === value),
      'Enter a valid date.'
    ),
  gender: z.enum(['', 'male', 'female', 'other', 'undisclosed']),
  bio: z.string().trim().max(1000, 'Use 1,000 characters or fewer.'),
})
const contactSchema = (requirePhone) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(2, 'Enter at least 2 characters.')
      .max(255, 'Use 255 characters or fewer.'),
    email: z.string().trim().email('Enter a valid email address.').max(255),
    phone: z
      .string()
      .trim()
      .max(50)
      .refine(
        (value) => (!requirePhone && !value) || hasValidPaymentPhone(value),
        requirePhone
          ? 'Add a valid mobile number to continue to payment.'
          : 'Enter a valid phone number.'
      ),
  })
const personalFields = [
  { name: 'dateOfBirth', label: 'Date of birth', type: 'date' },
  { name: 'gender', label: 'Gender' },
  { name: 'bio', label: 'About you' },
]
const contactFields = [
  { name: 'name', label: 'Full name', autoComplete: 'name', required: true },
  { name: 'email', label: 'Email address', type: 'email', autoComplete: 'email', required: true },
  { name: 'phone', label: 'Phone number', type: 'tel', autoComplete: 'tel' },
]

export default function ProfileSection({
  data,
  mutation,
  personal = false,
  requirePhone = false,
  startEditing = false,
  onSaved,
}) {
  const [editing, setEditing] = useState(startEditing)
  const fields = personal ? personalFields : contactFields
  const defaults = Object.fromEntries(
    fields.map(({ name }) => [
      name,
      name === 'dateOfBirth' ? data[name]?.slice(0, 10) || '' : data[name] || '',
    ])
  )
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: defaults,
    resolver: zodResolver(personal ? personalSchema : contactSchema(requirePhone)),
  })
  const busy = mutation.isPending || isSubmitting
  const edit = () => {
    reset(defaults)
    mutation.reset()
    setEditing(true)
  }
  const save = async (values) => {
    try {
      const saved = await mutation.mutateAsync(values)
      toast.success(personal ? 'Profile updated' : 'Contact information updated')
      setEditing(false)
      onSaved?.(saved)
    } catch (error) {
      setAccountFieldErrors(
        error,
        setError,
        fields.map((field) => field.name)
      )
    }
  }
  return (
    <AccountSection
      title={personal ? 'Personal information' : 'Contact information'}
      description={
        personal
          ? 'A few details to make your account your own.'
          : 'Keep your contact details up to date.'
      }
      action={
        !editing ? (
          <Button
            onClick={edit}
            size="small"
            variant="outlined"
            aria-label={personal ? 'Edit personal information' : 'Edit contact information'}
          >
            Edit
          </Button>
        ) : undefined
      }
    >
      {editing ? (
        <Box component="form" noValidate onSubmit={handleSubmit(save)}>
          <Stack spacing={2.5}>
            {fields.map(({ name, label, ...props }) => (
              <TextField
                key={name}
                id={'profile-' + name}
                {...props}
                {...register(name)}
                label={label}
                defaultValue={defaults[name]}
                fullWidth
                disabled={busy}
                error={Boolean(errors[name])}
                helperText={errors[name]?.message}
                select={name === 'gender'}
                multiline={name === 'bio'}
                minRows={name === 'bio' ? 3 : undefined}
                slotProps={{ inputLabel: props.type === 'date' ? { shrink: true } : undefined }}
              >
                {name === 'gender'
                  ? ['', 'male', 'female', 'other', 'undisclosed'].map((value) => (
                      <MenuItem key={value} value={value}>
                        {value ? value[0].toUpperCase() + value.slice(1) : 'Not specified'}
                      </MenuItem>
                    ))
                  : undefined}
              </TextField>
            ))}
            {!personal && (
              <Alert severity="info">
                Changing your email address resets its verification status.
              </Alert>
            )}
            {mutation.error && <AccountError error={mutation.error} />}
            <Stack direction="row" gap={1}>
              <Button type="submit" variant="contained" disabled={busy}>
                {busy ? 'Saving…' : 'Save changes'}
              </Button>
              <Button
                color="inherit"
                disabled={busy}
                onClick={() => {
                  setEditing(false)
                  mutation.reset()
                }}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Box>
      ) : (
        <Stack component="dl" spacing={2.5} sx={{ m: 0 }}>
          {fields.map(({ name, label }) => (
            <Box key={name}>
              <Typography component="dt" variant="body2" color="text.secondary">
                {label}
              </Typography>
              <Typography
                component="dd"
                sx={{
                  m: 0,
                  mt: 0.5,
                  overflowWrap: 'anywhere',
                  whiteSpace: name === 'bio' ? 'pre-wrap' : undefined,
                }}
              >
                {name === 'gender' && defaults[name]
                  ? defaults[name][0].toUpperCase() + defaults[name].slice(1)
                  : defaults[name] || 'Not provided'}
              </Typography>
            </Box>
          ))}
          {!personal && (
            <Typography variant="body2" color="text.secondary">
              {data.emailVerifiedAt ? 'Email verified' : 'Email not verified'}
            </Typography>
          )}
        </Stack>
      )}
    </AccountSection>
  )
}
