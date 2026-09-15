/**
 * Palette definitions for light and dark modes.
 */
const palette = (mode) => ({
  mode,
  primary: {
    main: mode === 'light' ? '#12695b' : '#79c8b7',
    light: '#79c8b7',
    dark: '#0b4b41',
    contrastText: mode === 'light' ? '#ffffff' : '#162b28',
  },
  secondary: {
    main: '#a86a35',
    light: '#d5a477',
    dark: '#805027',
    contrastText: '#ffffff',
  },
  success: {
    main: '#16a34a',
    light: '#4ade80',
    dark: '#15803d',
    contrastText: '#ffffff',
  },
  error: {
    main: '#dc2626',
    light: '#f87171',
    dark: '#b91c1c',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
    contrastText: '#ffffff',
  },
  info: {
    main: '#0ea5e9',
    light: '#38bdf8',
    dark: '#0369a1',
    contrastText: '#ffffff',
  },
  background: {
    default: mode === 'light' ? '#f6f7f4' : '#162b28',
    paper: mode === 'light' ? '#ffffff' : '#203632',
  },
  text: {
    primary: mode === 'light' ? '#162b28' : '#f1f5f2',
    secondary: mode === 'light' ? '#52645e' : '#9badA5',
    disabled: mode === 'light' ? '#9badA5' : '#64748b',
  },
  divider: mode === 'light' ? 'rgba(15, 23, 42, 0.12)' : 'rgba(248, 250, 252, 0.12)',
  action: {
    hover: mode === 'light' ? 'rgba(18, 105, 91, 0.08)' : 'rgba(18, 105, 91, 0.16)',
    selected: mode === 'light' ? 'rgba(18, 105, 91, 0.14)' : 'rgba(18, 105, 91, 0.24)',
  },
})

export default palette
