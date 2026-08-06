import PropTypes from 'prop-types'
import { Autocomplete, TextField } from '@mui/material'
import { POPULAR_LOCATIONS } from './searchConstants'

/**
 * Location picker with suggestions from popular locations.
 * Optionally supports separate drop location via `secondary`.
 */
function LocationSelector({ label = 'Location', value, onChange, disabled = false }) {
  return (
    <Autocomplete
      freeSolo
      options={POPULAR_LOCATIONS}
      value={value || ''}
      onChange={(_, newValue) => onChange && onChange(newValue ?? '')}
      onInputChange={(_, newValue) => onChange && onChange(newValue ?? '')}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          fullWidth
          placeholder="Enter pickup location"
          InputProps={{ ...params.InputProps }}
        />
      )}
    />
  )
}

LocationSelector.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
}

export default LocationSelector
