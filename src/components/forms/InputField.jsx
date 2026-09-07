import PropTypes from 'prop-types'
import { Controller, useFormContext } from 'react-hook-form'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import { useState } from 'react'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

/**
 * Controlled text input wired to react-hook-form.
 */
function InputField({ name, label, type = 'text', ...props }) {
  const { control } = useFormContext()
  const [visible, setVisible] = useState(false)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, ...field }, fieldState }) => (
        <TextField
          {...field}
          id={name}
          inputRef={ref}
          type={type === 'password' && visible ? 'text' : type}
          InputProps={
            type === 'password'
              ? {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        aria-label={visible ? 'Hide password' : 'Show password'}
                        onClick={() => setVisible((value) => !value)}
                      >
                        {visible ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              : undefined
          }
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
