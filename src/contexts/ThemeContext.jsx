import { createContext, useContext, useMemo, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material'
import buildTheme from '@/theme'
import { ThemeMode } from '@/types'

const ThemeContext = createContext(null)

/**
 * Theme provider that manages light/dark mode and unifies the MUI theme.
 */
export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(ThemeMode.LIGHT)

  const toggleTheme = useCallback(() => {
    setMode((prev) => (prev === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT))
  }, [])

  const setThemeMode = useCallback((nextMode) => {
    setMode(nextMode)
  }, [])

  const theme = useMemo(() => buildTheme(mode), [mode])

  const value = useMemo(
    () => ({ mode, toggleTheme, setThemeMode }),
    [mode, toggleTheme, setThemeMode]
  )

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

/**
 * Access theme context.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export default ThemeProvider
