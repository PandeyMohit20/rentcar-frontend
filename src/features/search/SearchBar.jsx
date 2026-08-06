import PropTypes from 'prop-types'
import { useState } from 'react'
import { Box, Button, Grid, Collapse } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import LocationSelector from './LocationSelector'
import DateRangePicker from './DateRangePicker'
import RecentSearches from './RecentSearches'
import PopularLocations from './PopularLocations'
import { useSearchHistory } from './useSearchHistory'
import { DEFAULT_PICKUP_TIME, DEFAULT_DROP_TIME } from './searchConstants'

const initialValues = () => ({
  location: '',
  pickupDate: '',
  pickupTime: '',
  dropDate: '',
  dropTime: '',
})

/**
 * Primary search form composing location, date/time range,
 * popular locations and recent-search history.
 */
function SearchBar({ initial = {}, onSearch }) {
  const [values, setValues] = useState({ ...initialValues(), ...initial })
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { searches, addSearch } = useSearchHistory()

  const set = (key) => (val) => setValues((prev) => ({ ...prev, [key]: val }))

  const handleSubmit = () => {
    addSearch(values)
    onSearch && onSearch(values)
  }

  const handleSelectLocation = (location) => {
    setValues((prev) => ({ ...prev, location }))
    setShowSuggestions(false)
  }

  const handleSelectRecent = (entry) => {
    setValues((prev) => ({ ...prev, ...entry }))
    setShowSuggestions(false)
    onSearch && onSearch({ ...values, ...entry })
  }

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <LocationSelector
            value={values.location}
            onChange={(v) => {
              setValues((prev) => ({ ...prev, location: v }))
              setShowSuggestions(true)
            }}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <DateRangePicker
            pickupDate={values.pickupDate}
            pickupTime={values.pickupTime}
            dropDate={values.dropDate}
            dropTime={values.dropTime}
            onPickupDate={set('pickupDate')}
            onPickupTime={set('pickupTime')}
            onDropDate={set('dropDate')}
            onDropTime={set('dropTime')}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            startIcon={<SearchIcon />}
            fullWidth
          >
            Search Cars
          </Button>
        </Grid>
      </Grid>

      <Collapse in={showSuggestions}>
        <Box sx={{ mt: 3 }}>
          <Box sx={{ mb: 2 }}>
            <PopularLocations onSelect={handleSelectLocation} />
          </Box>
          <RecentSearches onSelect={handleSelectRecent} />
        </Box>
      </Collapse>
    </Box>
  )
}

SearchBar.propTypes = {
  initial: PropTypes.object,
  onSearch: PropTypes.func,
}

export default SearchBar
