import { accountControlStyles } from '@/features/account/accountStyles'
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useAddAddress, useUpdateAddress } from './useAddresses'
import { AccountError } from '@/components/account/AccountUI'
import { setAccountFieldErrors } from '@/features/account/errors'

const types = ['home', 'work', 'billing', 'shipping', 'other']
const fields = [
  ['addressLine1', 'Address line 1', 'address-line1', true, 255],
  ['addressLine2', 'Address line 2', 'address-line2', false, 255],
  ['city', 'City', 'address-level2', true, 255],
  ['state', 'State / province', 'address-level1', false, 255],
  ['postalCode', 'Postal code', 'postal-code', false, 50],
  ['country', 'Country', 'country-name', true, 255],
]
const schema = z.object({
  ...Object.fromEntries(
    fields.map(([name, label, , required, max]) => [
      name,
      z
        .string()
        .trim()
        .min(required ? 1 : 0, label + ' is required.')
        .max(max, 'Use ' + max + ' characters or fewer.'),
    ])
  ),
  addressType: z.enum(types),
  isDefault: z.boolean(),
})
export default function AddressForm({ address, onClose }) {
  const create = useAddAddress()
  const update = useUpdateAddress()
  const mutation = address?.id ? update : create
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      ...Object.fromEntries(fields.map(([name]) => [name, address?.[name] || ''])),
      addressType: address?.addressType || 'home',
      isDefault: address?.isDefault || false,
    },
    resolver: zodResolver(schema),
  })
  const busy = mutation.isPending || isSubmitting
  const save = async (values) => {
    try {
      await mutation.mutateAsync(address?.id ? { id: address.id, ...values } : values)
      toast.success(address?.id ? 'Address updated' : 'Address added')
      onClose()
    } catch (error) {
      setAccountFieldErrors(
        error,
        setError,
        fields.map(([name]) => name)
      )
    }
  }
  return (
    <Dialog
      sx={accountControlStyles}
      open
      onClose={busy ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="address-form-title"
      slotProps={{
        paper: { sx: { m: { xs: 1, sm: 4 }, width: { xs: 'calc(100% - 16px)', sm: '100%' } } },
      }}
    >
      <DialogTitle id="address-form-title">
        {address?.id ? 'Edit address' : 'Add address'}
      </DialogTitle>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}
        component="form"
        noValidate
        onSubmit={handleSubmit(save)}
      >
        <DialogContent sx={{ pt: 1 }}>
          <Stack spacing={2.5}>
            <TextField
              id="address-type"
              select
              label="Address type"
              defaultValue={address?.addressType || 'home'}
              {...register('addressType')}
              disabled={busy}
            >
              {types.map((value) => (
                <MenuItem key={value} value={value}>
                  {value[0].toUpperCase() + value.slice(1)}
                </MenuItem>
              ))}
            </TextField>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))' },
                gap: 2.5,
              }}
            >
              {fields.map(([name, label, autoComplete, required]) => (
                <TextField
                  key={name}
                  id={'address-' + name}
                  label={label}
                  required={required}
                  autoComplete={autoComplete}
                  {...register(name)}
                  autoFocus={name === 'addressLine1'}
                  disabled={busy}
                  fullWidth
                  error={Boolean(errors[name])}
                  helperText={errors[name]?.message}
                  sx={{ gridColumn: name.startsWith('addressLine') ? '1 / -1' : undefined }}
                />
              ))}
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  {...register('isDefault')}
                  defaultChecked={address?.isDefault || false}
                  disabled={busy}
                />
              }
              label="Use as my default address"
            />
            {mutation.error && <AccountError error={mutation.error} />}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={busy}>
            {busy ? 'Saving…' : 'Save address'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
