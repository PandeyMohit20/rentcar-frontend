import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

/**
 * Responsive media query hooks built on MUI's useMediaQuery.
 */
export const useIsMobile = () => {
  const theme = useTheme()
  return useMediaQuery(theme.breakpoints.down('sm'))
}

export const useIsTablet = () => {
  const theme = useTheme()
  return useMediaQuery(theme.breakpoints.between('sm', 'md'))
}

export const useIsDesktop = () => {
  const theme = useTheme()
  return useMediaQuery(theme.breakpoints.up('md'))
}

export default useMediaQuery
