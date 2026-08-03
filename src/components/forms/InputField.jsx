import PropTypes from 'prop-types'
import { Controller, useFormContext } from 'react-hook-form'
import { TextField } from '@mui/material'

/**
 * Controlled text input wired to react-hook-form.
 */
function InputField({ name, label, type = 'text', ...props }) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          type={type}
          label={label}
          fullWidth
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message}
          {...props}
        />
      )}
    />
  )
}

InputField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
}

export default InputField
