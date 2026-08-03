/**
 * Global MUI component style overrides.
 */
const components = (mode) => ({
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        fontWeight: 600,
        textTransform: 'none',
        padding: '8px 20px',
      },
      sizeLarge: { padding: '12px 28px', fontSize: '1rem' },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow:
          mode === 'light' ? '0 2px 8px rgba(0, 0, 0, 0.06)' : '0 2px 8px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      variant: 'outlined',
      size: 'small',
    },
    styleOverrides: {
      root: { borderRadius: 8 },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: { borderRadius: 8 },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: 'none',
        borderBottom: `1px solid ${mode === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'}`,
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: { borderRadius: 6, fontWeight: 500 },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: { borderRadius: 16 },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: { borderRadius: 12 },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: { borderRadius: 6, fontSize: '0.75rem' },
    },
  },
})

export default components
