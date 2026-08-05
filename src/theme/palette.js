/**
 * Palette definitions for light and dark modes.
 */
const palette = (mode) => ({
  mode,
  primary: {
    main: '#2563eb',
    light: '#60a5fa',
    dark: '#1d4ed8',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#f97316',
    light: '#fb923c',
    dark: '#ea580c',
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
    default: mode === 'light' ? '#f8fafc' : '#0f172a',
    paper: mode === 'light' ? '#ffffff' : '#1e293b',
  },
  text: {
    primary: mode === 'light' ? '#0f172a' : '#f1f5f9',
    secondary: mode === 'light' ? '#475569' : '#94a3b8',
    disabled: mode === 'light' ? '#94a3b8' : '#64748b',
  },
  divider: mode === 'light' ? 'rgba(15, 23, 42, 0.12)' : 'rgba(248, 250, 252, 0.12)',
  action: {
    hover: mode === 'light' ? 'rgba(37, 99, 235, 0.08)' : 'rgba(37, 99, 235, 0.16)',
    selected: mode === 'light' ? 'rgba(37, 99, 235, 0.14)' : 'rgba(37, 99, 235, 0.24)',
  },
})

export default palette
