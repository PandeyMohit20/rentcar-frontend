import PropTypes from 'prop-types'
import { Box, Typography, Chip } from '@mui/material'
import MaterialCard from '@/components/ui/MaterialCard'
import { formatDate } from '@/utils/formatters'

const statusColor = (status) => {
  switch (status) {
    case 'open':
      return 'primary'
    case 'in_progress':
      return 'warning'
    case 'resolved':
      return 'success'
    case 'closed':
      return 'default'
    default:
      return 'default'
  }
}

/**
 * Support ticket summary card.
 */
function SupportTicketCard({ ticket = {}, onClick }) {
  return (
    <MaterialCard sx={{ p: 2, mb: 1, cursor: 'pointer' }} onClick={onClick} hoverable>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
        <Typography variant="subtitle2">
          #{ticket.id} — {ticket.subject}
        </Typography>
        <Chip label={ticket.status} color={statusColor(ticket.status)} size="small" />
      </Box>
      <Typography variant="body2" color="text.secondary" noWrap>
        {ticket.description}
      </Typography>
      <Typography variant="caption" color="text.disabled">
        {formatDate(ticket.createdAt)}
      </Typography>
    </MaterialCard>
  )
}

SupportTicketCard.propTypes = {
  ticket: PropTypes.object,
  onClick: PropTypes.func,
}

export default SupportTicketCard
