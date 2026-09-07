import { useDialogFocus } from '@/features/account/useDialogFocus'
import { useState } from 'react'
import { Box, Button, Chip, Stack, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import toast from 'react-hot-toast'
import AccountPageShell from '@/components/account/AccountPageShell'
import {
  AccountSection,
  AccountSkeleton,
  AccountError,
  AccountConfirm,
} from '@/components/account/AccountUI'
import { useSavedAddresses, useDeleteAddress } from '@/features/addresses'
import AddressForm from '@/features/addresses/AddressForm'

export default function SavedAddressesPage() {
  const query = useSavedAddresses()
  const deletion = useDeleteAddress()
  const [editing, setEditing] = useState(null)
  const [removing, setRemoving] = useState(null)
  const { captureFocus, restoreFocus } = useDialogFocus()
  const openEditor = (address) => {
    captureFocus()
    setEditing(address)
  }
  const closeEditor = () => {
    setEditing(null)
    restoreFocus()
  }
  const remove = async () => {
    if (deletion.isPending) return
    try {
      await deletion.mutateAsync(removing.id)
      toast.success('Address removed')
      setRemoving(null)
    } catch {
      /* Inline error. */
    }
  }
  return (
    <AccountPageShell
      title="Saved Addresses"
      description="Keep your home, work and other useful addresses in one place."
      actionLabel={!query.isPending && !query.error ? 'Add address' : undefined}
      actionIcon={AddIcon}
      onAction={() => openEditor({})}
    >
      {query.isPending ? (
        <AccountSkeleton />
      ) : query.error ? (
        <AccountError error={query.error} onRetry={() => query.refetch()} />
      ) : query.data.length === 0 ? (
        <AccountSection>
          <Stack alignItems="center" spacing={2} sx={{ py: 4, textAlign: 'center' }}>
            <LocationOnOutlinedIcon color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="h6">No saved addresses yet.</Typography>
            <Typography color="text.secondary">
              Add an address so it is easy to find next time.
            </Typography>
            <Button variant="contained" onClick={() => openEditor({})}>
              Add address
            </Button>
          </Stack>
        </AccountSection>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'repeat(2, minmax(0, 1fr))' },
            gap: 3,
          }}
        >
          {query.data.map((address) => (
            <AccountSection key={address.id}>
              <Stack spacing={2}>
                <Stack direction="row" gap={1} alignItems="center">
                  <LocationOnOutlinedIcon color="primary" />
                  <Typography variant="h6" component="h2" sx={{ textTransform: 'capitalize' }}>
                    {address.addressType}
                  </Typography>
                  {address.isDefault && (
                    <Chip label="Default" size="small" color="primary" variant="outlined" />
                  )}
                </Stack>
                <Box sx={{ overflowWrap: 'anywhere' }}>
                  <Typography>{address.addressLine1}</Typography>
                  {address.addressLine2 && <Typography>{address.addressLine2}</Typography>}
                  <Typography>
                    {[address.city, address.state, address.postalCode].filter(Boolean).join(', ')}
                  </Typography>
                  <Typography color="text.secondary">{address.country}</Typography>
                </Box>
                <Stack direction="row" gap={1}>
                  <Button
                    variant="outlined"
                    onClick={() => openEditor(address)}
                    aria-label={'Edit ' + address.addressType + ' address'}
                  >
                    Edit
                  </Button>
                  <Button
                    color="error"
                    onClick={() => {
                      deletion.reset()
                      setRemoving(address)
                    }}
                    aria-label={'Delete ' + address.addressType + ' address'}
                  >
                    Delete
                  </Button>
                </Stack>
              </Stack>
            </AccountSection>
          ))}
        </Box>
      )}
      {editing && <AddressForm address={editing} onClose={closeEditor} />}
      <AccountConfirm
        open={Boolean(removing)}
        title="Delete this address?"
        message="This saved address will be removed from your account."
        onClose={() => setRemoving(null)}
        onConfirm={remove}
        pending={deletion.isPending}
        error={deletion.error}
      />
    </AccountPageShell>
  )
}
