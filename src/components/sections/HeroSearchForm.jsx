import PropTypes from 'prop-types'
import { Box, Paper, TextField, MenuItem, InputAdornment, Button } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import SearchIcon from '@mui/icons-material/Search'

/**
 * Hero search bar for location + dates + category.
 * Presentational only — calls onSearch with form values.
 */
function HeroSearchForm({ locations = [], categories = [], onSearch }) {
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
        defaultValue=""
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
          <MenuItem key={loc} value={loc}>
            {loc}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        type="date"
        label="Pickup"
        defaultValue=""
        InputLabelProps={{ shrink: true }}
        fullWidth
      />
      <TextField
        type="date"
        label="Drop"
        defaultValue=""
        InputLabelProps={{ shrink: true }}
        fullWidth
      />

      <TextField select label="Category" defaultValue="" fullWidth sx={{ flex: { md: 1 } }}>
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
        onClick={() => onSearch && onSearch()}
        sx={{ px: 4, whiteSpace: 'nowrap' }}
      >
        Search
      </Button>
    </Paper>
  )
}

HeroSearchForm.propTypes = {
  locations: PropTypes.arrayOf(PropTypes.string),
  categories: PropTypes.arrayOf(PropTypes.string),
  onSearch: PropTypes.func,
}

export default HeroSearchForm
