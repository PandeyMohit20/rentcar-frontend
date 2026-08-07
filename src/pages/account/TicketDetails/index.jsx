import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Grid, Box, Typography, Chip, Button } from '@mui/material'
import { AccountPageShell } from '@/components/account'
import { useTicketDetails, useReplyToTicket } from '@/features/support'
import { useToast } from '@/contexts/ToastContext'
import MaterialCard from '@/components/ui/MaterialCard'
import InputField from '@/components/forms/InputField'
import LoadingButton from '@/components/buttons/LoadingButton'
import { useForm, FormProvider } from 'react-hook-form'
import { ROUTES } from '@/constants/routes'

/**
 * Ticket Details page — conversation, status and reply placeholder.
 */
function TicketDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const { data: ticketData, isLoading } = useTicketDetails(id)
  const reply = useReplyToTicket()

  const ticket = useMemo(() => ticketData ?? {}, [ticketData])
  const messages = useMemo(() => ticket.messages ?? [], [ticket])

  const methods = useForm({ defaultValues: { message: '' } })

  const handleReply = async (values) => {
    try {
      await reply.mutateAsync({ id, ...values })
      showSuccess('Reply sent.')
      methods.reset()
    } catch (error) {
      showError(error?.message || 'Failed to send reply.')
    }
  }

  return (
    <AccountPageShell title="Ticket Details" description={`Ticket ${id}`}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MaterialCard sx={{ p: 3 }}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
            >
              <Typography variant="h6">
                #{ticket.id} — {ticket.subject ?? ''}
              </Typography>
              <Chip label={ticket.status ?? 'open'} />
            </Box>
            {isLoading && <Typography variant="body2">Loading…</Typography>}
            {messages.map((msg) => (
              <Box key={msg.id} sx={{ mb: 1 }}>
                <Typography variant="body2">{msg.body ?? msg.message}</Typography>
                <Typography variant="caption" color="text.disabled">
                  {msg.createdAt ?? ''}
                </Typography>
              </Box>
            ))}
          </MaterialCard>
        </Grid>
        <Grid item xs={12}>
          <MaterialCard sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Reply
            </Typography>
            <FormProvider {...methods}>
              <Box
                component="form"
                onSubmit={methods.handleSubmit(handleReply)}
                sx={{ display: 'grid', gap: 2 }}
              >
                <InputField name="message" label="Your message" multiline minRows={3} />
                <LoadingButton type="submit" loading={reply.isPending}>
                  Send Reply
                </LoadingButton>
              </Box>
            </FormProvider>
          </MaterialCard>
        </Grid>
      </Grid>
    </AccountPageShell>
  )
}

export default TicketDetailsPage
