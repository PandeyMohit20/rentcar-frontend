import PropTypes from 'prop-types'
import { Controller, useFormContext } from 'react-hook-form'
import { Checkbox, FormControlLabel, FormHelperText } from '@mui/material'

/**
 * Controlled checkbox wired to react-hook-form.
 */
function CheckboxField({ name, label, ...props }) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <>
          <FormControlLabel
            control={<Checkbox {...field} checked={Boolean(field.value)} {...props} />}
            label={label}
          />
          {fieldState.error && <FormHelperText error>{fieldState.error.message}</FormHelperText>}
        </>
      )}
    />
  )
}

CheckboxField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.node,
}

export default CheckboxField
