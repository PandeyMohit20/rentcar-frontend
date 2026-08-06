import PropTypes from 'prop-types'
import { Grid, TextField } from '@mui/material'

/**
 * Date + time range selector for pickup/return.
 * Uses native date/time inputs — no extra dependencies.
 */
function DateRangePicker({
  pickupDate,
  pickupTime,
  dropDate,
  dropTime,
  onPickupDate,
  onPickupTime,
  onDropDate,
  onDropTime,
}) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        <TextField
          label="Pickup Date"
          type="date"
          value={pickupDate || ''}
          onChange={(e) => onPickupDate && onPickupDate(e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          label="Pickup Time"
          type="time"
          value={pickupTime || ''}
          onChange={(e) => onPickupTime && onPickupTime(e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          label="Return Date"
          type="date"
          value={dropDate || ''}
          onChange={(e) => onDropDate && onDropDate(e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          label="Return Time"
          type="time"
          value={dropTime || ''}
          onChange={(e) => onDropTime && onDropTime(e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
    </Grid>
  )
}

DateRangePicker.propTypes = {
  pickupDate: PropTypes.string,
  pickupTime: PropTypes.string,
  dropDate: PropTypes.string,
  dropTime: PropTypes.string,
  onPickupDate: PropTypes.func,
  onPickupTime: PropTypes.func,
  onDropDate: PropTypes.func,
  onDropTime: PropTypes.func,
}

export default DateRangePicker
