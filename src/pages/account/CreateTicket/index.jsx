import { Box, MenuItem } from '@mui/material'
import { useForm, FormProvider } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { AccountPageShell } from '@/components/account'
import { useCreateTicket } from '@/features/support'
import { useToast } from '@/contexts/ToastContext'
import InputField from '@/components/forms/InputField'
import LoadingButton from '@/components/buttons/LoadingButton'
import MaterialCard from '@/components/ui/MaterialCard'
import { ROUTES } from '@/constants/routes'

const CATEGORY_OPTIONS = [
  { value: 'booking', label: 'Booking' },
  { value: 'payment', label: 'Payment' },
  { value: 'refund', label: 'Refund' },
  { value: 'support', label: 'General Support' },
  { value: 'technical', label: 'Technical Issue' },
  { value: 'other', label: 'Other' },
]

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
]

/**
 * Create customer support ticket.
 */
function CreateTicketPage() {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const createTicket = useCreateTicket()

  const methods = useForm({
    defaultValues: {
      subject: '',
      category: 'support',
      description: '',
      priority: 'medium',
    },
    mode: 'onTouched',
  })

  const handleSubmit = async (values) => {
    try {
      const response = await createTicket.mutateAsync({
        subject: values.subject.trim(),
        category: values.category,
        description: values.description.trim(),
        priority: values.priority,
      })

      showSuccess('Ticket created successfully.')

      const ticket = response?.data?.data ?? response?.data ?? response
      const id = ticket?.id

      navigate(id ? ROUTES.TICKET_DETAILS_WITH_ID(id) : ROUTES.ACCOUNT_SUPPORT)
    } catch (error) {
      showError(error?.response?.data?.message || error?.message || 'Failed to create ticket.')
    }
  }

  return (
    <AccountPageShell title="Create Ticket" description="Tell us how we can help.">
      <MaterialCard sx={{ p: { xs: 2, sm: 3 } }}>
        <FormProvider {...methods}>
          <Box
            component="form"
            onSubmit={methods.handleSubmit(handleSubmit)}
            sx={{
              display: 'grid',
              gap: 2,
              maxWidth: 760,
            }}
          >
            <InputField
              name="subject"
              label="Subject"
              required
              rules={{
                required: 'Please enter a subject.',
                minLength: {
                  value: 3,
                  message: 'Subject must be at least 3 characters.',
                },
                maxLength: {
                  value: 255,
                  message: 'Subject cannot exceed 255 characters.',
                },
              }}
            />

            <InputField select name="category" label="Category" required>
              {CATEGORY_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </InputField>

            <InputField select name="priority" label="Priority" required>
              {PRIORITY_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </InputField>

            <InputField
              name="description"
              label="Description"
              required
              multiline
              minRows={5}
              rules={{
                required: 'Please describe your issue.',
                minLength: {
                  value: 1,
                  message: 'Please enter your issue.',
                },
                maxLength: {
                  value: 10000,
                  message: 'Description cannot exceed 10,000 characters.',
                },
              }}
            />

            <Box
              sx={{
                display: 'flex',
                gap: 1.5,
                flexWrap: 'wrap',
              }}
            >
              <LoadingButton type="submit" loading={createTicket.isPending}>
                Submit Ticket
              </LoadingButton>

              <LoadingButton
                type="button"
                variant="outlined"
                disabled={createTicket.isPending}
                onClick={() => navigate(ROUTES.ACCOUNT_SUPPORT)}
              >
                Cancel
              </LoadingButton>
            </Box>
          </Box>
        </FormProvider>
      </MaterialCard>
    </AccountPageShell>
  )
}

export default CreateTicketPage
