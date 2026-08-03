import PropTypes from 'prop-types'
import { Controller, useFormContext } from 'react-hook-form'
import { TextField, MenuItem } from '@mui/material'

/**
 * Controlled select input wired to react-hook-form.
 */
function SelectField({ name, label, options = [], ...props }) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          select
          label={label}
          fullWidth
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message}
          {...props}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  )
}

SelectField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
}

export default SelectField
