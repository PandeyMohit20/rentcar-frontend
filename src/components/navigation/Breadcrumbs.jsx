import PropTypes from 'prop-types'
import { Breadcrumbs as MuiBreadcrumbs, Typography, Link } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

/**
 * Accessible breadcrumb navigation.
 */
function Breadcrumbs({ items = [] }) {
  if (items.length === 0) return null

  return (
    <MuiBreadcrumbs aria-label="breadcrumb" sx={{ my: 2 }}>
      <Link component={RouterLink} to={ROUTES.HOME} color="inherit" underline="hover">
        Home
      </Link>
      {items.map((item, index) =>
        index === items.length - 1 ? (
          <Typography key={item.label} color="text.primary">
            {item.label}
          </Typography>
        ) : (
          <Link
            key={item.label}
            component={RouterLink}
            to={item.to}
            color="inherit"
            underline="hover"
          >
            {item.label}
          </Link>
        )
      )}
    </MuiBreadcrumbs>
  )
}

Breadcrumbs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      to: PropTypes.string,
    })
  ),
}

export default Breadcrumbs
