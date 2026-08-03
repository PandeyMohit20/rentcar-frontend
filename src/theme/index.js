import { createTheme } from '@mui/material/styles'
import palette from './palette'
import typography from './typography'
import breakpoints from './breakpoints'
import components from './components'

/**
 * Builds the MUI theme for the given mode ('light' | 'dark').
 */
const buildTheme = (mode = 'light') =>
  createTheme({
    palette: palette(mode),
    typography,
    breakpoints,
    components: components(mode),
    shape: { borderRadius: 10 },
    spacing: 8,
  })

export default buildTheme
