import PropTypes from 'prop-types'
import { useState } from 'react'
import { Paper, TextField, MenuItem, InputAdornment, Button } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import SearchIcon from '@mui/icons-material/Search'

/**
 * Hero search bar for location + dates + category.
 * Presentational only — calls onSearch with form values.
 */
function HeroSearchForm({ locations = [], categories = [], onSearch }) {
  const [values, setValues] = useState({
    branchId: '',
    pickupDate: '',
    pickupTime: '',
    returnDate: '',
    returnTime: '',
    brand: '',
  })
  const update = (key) => (event) =>
    setValues((current) => ({ ...current, [key]: event.target.value }))
  return (
    <Paper
      elevation={6}
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        alignItems: 'stretch',
        borderRadius: 3,
        maxWidth: 860,
      }}
    >
      <TextField
        select
        label="Pickup Location"
        value={values.branchId}
        onChange={update('branchId')}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocationOnIcon color="primary" />
            </InputAdornment>
          ),
        }}
        sx={{ flex: { md: 1 } }}
      >
        <MenuItem value="">Select city</MenuItem>
        {locations.map((loc) => (
          <MenuItem key={loc.id} value={loc.id}>
            {loc.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        type="date"
        label="Pickup"
        value={values.pickupDate}
        onChange={update('pickupDate')}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />
      <TextField
        type="time"
        label="Pickup time"
        value={values.pickupTime}
        onChange={update('pickupTime')}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />
      <TextField
        type="date"
        label="Return"
        value={values.returnDate}
        onChange={update('returnDate')}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />
      <TextField
        type="time"
        label="Return time"
        value={values.returnTime}
        onChange={update('returnTime')}
        InputLabelProps={{ shrink: true }}
        fullWidth
      />

      <TextField
        select
        label="Brand"
        value={values.brand}
        onChange={update('brand')}
        fullWidth
        sx={{ flex: { md: 1 } }}
      >
        <MenuItem value="">All</MenuItem>
        {categories.map((cat) => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </TextField>

      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={<SearchIcon />}
        onClick={() => onSearch && onSearch(values)}
        sx={{ px: 4, whiteSpace: 'nowrap' }}
      >
        Search
      </Button>
    </Paper>
  )
}

HeroSearchForm.propTypes = {
  locations: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string.isRequired, label: PropTypes.string.isRequired })
  ),
  categories: PropTypes.arrayOf(PropTypes.string),
  onSearch: PropTypes.func,
}

export default HeroSearchForm
