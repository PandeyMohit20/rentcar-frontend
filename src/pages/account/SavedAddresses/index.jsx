import { useMemo, useState } from 'react'
import {
  Grid,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { AccountPageShell, AddressCard } from '@/components/account'
import { useSavedAddresses, useAddAddress, useDeleteAddress } from '@/features/addresses'
import { useToast } from '@/contexts/ToastContext'
import MaterialCard from '@/components/ui/MaterialCard'
import InputField from '@/components/forms/InputField'
import { useForm, FormProvider } from 'react-hook-form'
import LoadingButton from '@/components/buttons/LoadingButton'

/**
 * Saved Addresses page — list and add new addresses.
 */
function SavedAddressesPage() {
  const { showSuccess, showError } = useToast()
  const { data } = useSavedAddresses()
  const addAddress = useAddAddress()
  const deleteAddress = useDeleteAddress()

  const [open, setOpen] = useState(false)
  const addresses = useMemo(() => data?.addresses ?? [], [data])

  const methods = useForm({
    defaultValues: { label: '', line: '', city: '', state: '', pincode: '' },
  })

  const handleAdd = async (values) => {
    try {
      await addAddress.mutateAsync(values)
      showSuccess('Address added.')
      setOpen(false)
      methods.reset()
    } catch (error) {
      showError(error?.message || 'Failed to add address.')
    }
  }

  const handleDelete = async (address) => {
    try {
      await deleteAddress.mutateAsync(address.id)
      showSuccess('Address removed.')
    } catch (error) {
      showError(error?.message || 'Failed to delete address.')
    }
  }

  return (
    <AccountPageShell
      title="Saved Addresses"
      description="Manage your frequently used addresses."
      actionLabel="Add Address"
      actionIcon={AddIcon}
      onAction={() => setOpen(true)}
    >
      {addresses.length === 0 && (
        <MaterialCard sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No saved addresses yet.
          </Typography>
        </MaterialCard>
      )}
      <Box>
        {addresses.map((address) => (
          <AddressCard key={address.id} address={address} onDelete={handleDelete} />
        ))}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add Address</DialogTitle>
        <DialogContent>
          <FormProvider {...methods}>
            <Box component="form" onSubmit={methods.handleSubmit(handleAdd)}>
              <InputField name="label" label="Label (e.g. Home, Office)" />
              <InputField name="line" label="Address Line" />
              <InputField name="city" label="City" />
              <InputField name="state" label="State" />
              <InputField name="pincode" label="Pincode" />
              <LoadingButton type="submit" loading={addAddress.isPending}>
                Save Address
              </LoadingButton>
            </Box>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </AccountPageShell>
  )
}

export default SavedAddressesPage
