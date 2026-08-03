import PropTypes from 'prop-types'
import { Grid } from '@mui/material'

/**
 * Standard responsive grid container.
 */
function GridContainer({ children, spacing = 3, ...props }) {
  return (
    <Grid container spacing={spacing} {...props}>
      {children}
    </Grid>
  )
}

GridContainer.propTypes = {
  children: PropTypes.node.isRequired,
  spacing: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

export default GridContainer
