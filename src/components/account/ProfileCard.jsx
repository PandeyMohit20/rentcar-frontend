import PropTypes from 'prop-types'
import { Box, Typography, Chip } from '@mui/material'
import MaterialCard from '@/components/ui/MaterialCard'
import UserAvatar from './UserAvatar'

/**
 * Compact profile summary card used in the account sidebar/dashboard.
 */
function ProfileCard({ user = {}, onView }) {
  const completion = user?.profileCompletion ?? 0

  return (
    <MaterialCard sx={{ p: 3, textAlign: 'center' }} onClick={onView} hoverable>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
        <UserAvatar
          firstName={user?.firstName}
          lastName={user?.lastName}
          src={user?.avatar}
          size={64}
        />
      </Box>
      <Typography variant="subtitle1">
        {user?.firstName} {user?.lastName}
      </Typography>
      <Typography variant="body2" color="text.secondary" noWrap>
        {user?.email}
      </Typography>
      <Chip
        label={`${completion}% complete`}
        size="small"
        color={completion === 100 ? 'success' : 'default'}
        sx={{ mt: 1 }}
      />
    </MaterialCard>
  )
}

ProfileCard.propTypes = {
  user: PropTypes.object,
  onView: PropTypes.func,
}

export default ProfileCard
