import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Alert } from '@mui/material'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import { AccountPageShell, SupportTicketCard } from '@/components/account'
import { useTickets } from '@/features/support'
import EmptyState from '@/components/common/EmptyState'
import { ROUTES } from '@/constants/routes'

/**
 * Customer support ticket list.
 */
function SupportPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError, error } = useTickets()

  const tickets = useMemo(() => data?.tickets ?? [], [data])

  return (
    <AccountPageShell
      title="Support"
      description="Manage your support tickets."
      actionLabel="Create Ticket"
      onAction={() => navigate(ROUTES.CREATE_TICKET)}
    >
      {isLoading && <Typography variant="body2">Loading tickets…</Typography>}

      {isError && (
        <Alert severity="error">
          {error?.response?.data?.message ||
            error?.message ||
            'Unable to load your support tickets.'}
        </Alert>
      )}

      {!isLoading && !isError && tickets.length === 0 && (
        <EmptyState
          icon={SupportAgentIcon}
          title="No support tickets"
          description="Reach out and we'll help you right away."
          actionLabel="Create Ticket"
          onAction={() => navigate(ROUTES.CREATE_TICKET)}
        />
      )}

      {!isLoading && !isError && tickets.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gap: 1.5,
          }}
        >
          {tickets.map((ticket) => (
            <SupportTicketCard
              key={ticket.id}
              ticket={ticket}
              onClick={() => navigate(ROUTES.TICKET_DETAILS_WITH_ID(ticket.id))}
            />
          ))}
        </Box>
      )}
    </AccountPageShell>
  )
}

export default SupportPage
