import { Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { useForm, FormProvider } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { AccountPageShell } from '@/components/account'
import { useCreateTicket } from '@/features/support'
import { useToast } from '@/contexts/ToastContext'
import InputField from '@/components/forms/InputField'
import LoadingButton from '@/components/buttons/LoadingButton'
import MaterialCard from '@/components/ui/MaterialCard'
import { ROUTES } from '@/constants/routes'

/**
 * Create Ticket page — new support ticket form (placeholder).
 */
function CreateTicketPage() {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const createTicket = useCreateTicket()

  const methods = useForm({
    defaultValues: { subject: '', category: '', description: '', priority: '' },
  })

  const handleSubmit = async (values) => {
    try {
      const res = await createTicket.mutateAsync(values)
      showSuccess('Ticket created successfully.')
      const id = res?.data?.id ?? res?.id
      navigate(id ? ROUTES.TICKET_DETAILS_WITH_ID(id) : ROUTES.ACCOUNT_SUPPORT)
    } catch (error) {
      showError(error?.message || 'Failed to create ticket.')
    }
  }

  return (
    <AccountPageShell title="Create Ticket" description="Tell us how we can help.">
      <MaterialCard sx={{ p: 3 }}>
        <FormProvider {...methods}>
          <Box
            component="form"
            onSubmit={methods.handleSubmit(handleSubmit)}
            sx={{ display: 'grid', gap: 2 }}
          >
            <InputField name="subject" label="Subject" />
            <InputField name="category" label="Category" />
            <InputField name="priority" label="Priority" />
            <InputField name="description" label="Description" multiline minRows={4} />
            <LoadingButton type="submit" loading={createTicket.isPending}>
              Submit Ticket
            </LoadingButton>
          </Box>
        </FormProvider>
      </MaterialCard>
    </AccountPageShell>
  )
}

export default CreateTicketPage
