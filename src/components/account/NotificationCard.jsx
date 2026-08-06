import PropTypes from 'prop-types'
import { Box, Typography, Chip } from '@mui/material'
import MaterialCard from '@/components/ui/MaterialCard'
import { formatDate } from '@/utils/formatters'

/**
 * Notification item card.
 */
function NotificationCard({ notification = {}, onClick }) {
  const typeColor = (type) => {
    switch (type) {
      case 'booking':
        return 'primary'
      case 'offer':
        return 'success'
      case 'system':
        return 'info'
      case 'security':
        return 'warning'
      default:
        return 'default'
    }
  }

  return (
    <MaterialCard sx={{ p: 2, mb: 1, cursor: 'pointer' }} onClick={onClick}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
        <Typography variant="subtitle2">{notification.title}</Typography>
        <Chip label={notification.type} color={typeColor(notification.type)} size="small" />
      </Box>
      <Typography variant="body2" color="text.secondary">
        {notification.message}
      </Typography>
      <Typography variant="caption" color="text.disabled">
        {formatDate(notification.createdAt)}
      </Typography>
    </MaterialCard>
  )
}

NotificationCard.propTypes = {
  notification: PropTypes.object,
  onClick: PropTypes.func,
}

export default NotificationCard
