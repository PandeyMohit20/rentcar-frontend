import { alpha } from '@mui/material/styles'

// Scope account refinements to the existing theme; public pages keep their styles.
export const accountControlStyles = (theme) => {
  const dark = theme.palette.mode === 'dark'
  const primary = dark ? theme.palette.primary.light : theme.palette.primary.main
  return {
    '& .MuiButtonBase-root:focus-visible, & a:focus-visible': {
      outline: '3px solid',
      outlineColor: primary,
      outlineOffset: 3,
    },
    '& .MuiCard-root': { border: 1, borderColor: 'divider', boxShadow: 'none' },
    '& .MuiButton-textPrimary:not(.Mui-disabled), & .MuiButton-outlinedPrimary:not(.Mui-disabled), & .MuiFormLabel-root.Mui-focused:not(.Mui-error)':
      {
        color: primary,
      },
    '& .MuiButton-textError:not(.Mui-disabled), & .MuiButton-outlinedError:not(.Mui-disabled), & .MuiFormHelperText-root.Mui-error, & .MuiFormLabel-root.Mui-error':
      {
        color: dark ? theme.palette.error.light : theme.palette.error.main,
      },
    // Text carries status meaning with sufficient contrast in both theme modes.
    ...Object.fromEntries(
      ['primary', 'success', 'warning', 'error', 'info'].map((color) => [
        `& .MuiChip-color${color[0].toUpperCase() + color.slice(1)}`,
        {
          color: 'text.primary',
          bgcolor: alpha(theme.palette[color].main, 0.12),
          borderColor: 'divider',
        },
      ])
    ),
  }
}

export const accountSurfaceStyles = (theme) => ({
  minHeight: '100vh',
  bgcolor: 'background.default',
  ...accountControlStyles(theme),
})
