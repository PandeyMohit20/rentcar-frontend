import { AppBar, Toolbar, IconButton, Button, Box } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useTheme } from '@/contexts/ThemeContext'

function Topbar({ onMenuClick, menuOpen }) {
  const { mode, toggleTheme } = useTheme()
  return (
    <AppBar position="static" color="inherit" elevation={0}>
      <Toolbar sx={{ gap: 1 }}>
        <IconButton
          color="inherit"
          aria-label="Open account navigation"
          aria-expanded={menuOpen}
          aria-controls={menuOpen ? 'account-mobile-navigation' : undefined}
          onClick={onMenuClick}
          sx={{ display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Button
          component={Link}
          to={ROUTES.HOME}
          color="inherit"
          sx={{ fontWeight: 800, fontSize: '1.15rem', px: 1 }}
        >
          RentCar
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton
          onClick={toggleTheme}
          aria-label={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {mode === 'light' ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
        </IconButton>
        <Button component={Link} to={ROUTES.SEARCH} variant="outlined" size="small">
          Find a car
        </Button>
      </Toolbar>
    </AppBar>
  )
}
export default Topbar
