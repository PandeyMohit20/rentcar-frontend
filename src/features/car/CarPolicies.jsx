import PropTypes from 'prop-types'
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'
import CancelIcon from '@mui/icons-material/Cancel'

/**
 * Car policies: booking, fuel and cancellation guidance.
 */
function CarPolicies({ policies = {} }) {
  const booking = policies?.booking
  const fuel = policies?.fuel
  const cancellation = policies?.cancellation

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Policies
      </Typography>
      <List dense>
        <ListItem>
          <ListItemIcon>
            <EventAvailableIcon />
          </ListItemIcon>
          <ListItemText
            primary="Booking"
            secondary={booking || 'Minimum booking duration applies.'}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <LocalGasStationIcon />
          </ListItemIcon>
          <ListItemText primary="Fuel" secondary={fuel || 'Fuel charged as per usage.'} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <CancelIcon />
          </ListItemIcon>
          <ListItemText
            primary="Cancellation"
            secondary={cancellation || 'Free cancellation up to 24 hours before pickup.'}
          />
        </ListItem>
      </List>
    </Box>
  )
}

CarPolicies.propTypes = {
  policies: PropTypes.object,
}

export default CarPolicies
