import PropTypes from 'prop-types'
import { Avatar } from '@mui/material'
import { initials } from '@/utils/formatters'

/**
 * Avatar that renders user initials or a provided image.
 */
function UserAvatar({ firstName = '', lastName = '', src, size = 40, ...props }) {
  return (
    <Avatar
      src={src}
      alt={`${firstName} ${lastName}`.trim() || 'User'}
      sx={{ width: size, height: size, fontSize: size / 2.5, ...props.sx }}
      {...props}
    >
      {!src && initials(firstName, lastName)}
    </Avatar>
  )
}

UserAvatar.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  src: PropTypes.string,
  size: PropTypes.number,
}

export default UserAvatar
