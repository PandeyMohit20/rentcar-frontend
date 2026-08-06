import PropTypes from 'prop-types'
import { Box, Typography } from '@mui/material'
import MaterialCard from '@/components/ui/MaterialCard'

/**
 * Generic dashboard stat widget.
 */
function DashboardWidget({ icon: Icon, label, value, color = 'primary', onClick }) {
  return (
    <MaterialCard
      sx={{ p: 3, cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
      hoverable
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {Icon && <Icon sx={{ fontSize: 40, color: `${color}.main` }} />}
        <Box>
          <Typography variant="overline" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h5">{value}</Typography>
        </Box>
      </Box>
    </MaterialCard>
  )
}

DashboardWidget.propTypes = {
  icon: PropTypes.elementType,
  label: PropTypes.string,
  value: PropTypes.node,
  color: PropTypes.string,
  onClick: PropTypes.func,
}

export default DashboardWidget
