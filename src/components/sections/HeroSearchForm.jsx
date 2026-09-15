import { useState } from 'react'
import { Box, Paper, TextField, MenuItem, Button, Typography } from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import DateTimeSelector from '@/features/search/DateTimeSelector'

export default function HeroSearchForm({ locations = [], onSearch }) {
  const [values, setValues] = useState({
    branchId: '',
    pickupDate: '',
    pickupTime: '',
    returnDate: '',
    returnTime: '',
  })
  const update = (key) => (event) =>
    setValues((current) => ({ ...current, [key]: event.target.value }))
  return (
    <Paper
      component="form"
      onSubmit={(event) => {
        event.preventDefault()
        onSearch?.(values)
      }}
      sx={{
        p: { xs: 2.5, md: 3 },
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        boxShadow: '0 12px 40px rgba(16,35,32,.07)',
      }}
    >
      <Typography component="h2" variant="h6" sx={{ mb: 2.5 }}>
        Where will your next journey take you?
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'minmax(0,1fr)', lg: '1.2fr 1fr 1fr auto' },
          gap: 2,
          alignItems: 'end',
        }}
      >
        <Box>
          <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 700 }}>
            PICKUP LOCATION
          </Typography>
          <TextField
            select
            label="Pickup location"
            value={values.branchId}
            onChange={update('branchId')}
            fullWidth
          >
            <MenuItem value="">All pickup locations</MenuItem>
            {locations.map((location) => (
              <MenuItem key={location.id} value={location.id}>
                {location.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <DateTimeSelector
          label="Pickup"
          date={values.pickupDate}
          time={values.pickupTime}
          onDateChange={update('pickupDate')}
          onTimeChange={update('pickupTime')}
        />
        <DateTimeSelector
          label="Return"
          date={values.returnDate}
          time={values.returnTime}
          onDateChange={update('returnDate')}
          onTimeChange={update('returnTime')}
        />
        <Button
          variant="contained"
          type="submit"
          startIcon={<SearchRoundedIcon />}
          sx={{ minHeight: 44 }}
        >
          Search Cars
        </Button>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
        All trip times are in IST (Asia/Kolkata). Leave dates empty to explore the fleet.
      </Typography>
    </Paper>
  )
}
