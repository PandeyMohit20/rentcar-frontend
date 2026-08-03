/**
 * Palette definitions for light and dark modes.
 */
const palette = (mode) => ({
  mode,
  primary: {
    main: '#1976d2',
    light: '#63a4ff',
    dark: '#004ba0',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#ff6f00',
    light: '#ffa040',
    dark: '#c43e00',
    contrastText: '#ffffff',
  },
  success: {
    main: '#2e7d32',
    light: '#4caf50',
    dark: '#1b5e20',
    contrastText: '#ffffff',
  },
  error: {
    main: '#d32f2f',
    light: '#ef5350',
    dark: '#b71c1c',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#ed6c02',
    light: '#ff9800',
    dark: '#e65100',
    contrastText: '#ffffff',
  },
  info: {
    main: '#0288d1',
    light: '#03a9f4',
    dark: '#01579b',
    contrastText: '#ffffff',
  },
  background: {
    default: mode === 'light' ? '#f5f7fa' : '#121212',
    paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
  },
  text: {
    primary: mode === 'light' ? '#1a1a2e' : '#f5f5f5',
    secondary: mode === 'light' ? '#5f6368' : '#b0b0b0',
    disabled: mode === 'light' ? '#9e9e9e' : '#6e6e6e',
  },
  divider: mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)',
  action: {
    hover: mode === 'light' ? 'rgba(25, 118, 210, 0.08)' : 'rgba(25, 118, 210, 0.16)',
    selected: mode === 'light' ? 'rgba(25, 118, 210, 0.14)' : 'rgba(25, 118, 210, 0.24)',
  },
})

export default palette
