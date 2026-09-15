import { Box, TextField, Typography } from '@mui/material'

export default function DateTimeSelector({ label, date, time, onDateChange, onTimeChange }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        variant="caption"
        sx={{ display: 'block', mb: 1, fontWeight: 700, textTransform: 'uppercase' }}
      >
        {label}
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: 1 }}>
        <TextField
          fullWidth
          type="date"
          label={`${label} date`}
          value={date}
          onChange={onDateChange}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          fullWidth
          type="time"
          label={`${label} time`}
          value={time}
          onChange={onTimeChange}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Box>
    </Box>
  )
}
